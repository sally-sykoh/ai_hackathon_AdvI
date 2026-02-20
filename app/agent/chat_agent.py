"""
AdvI Chat Agent — student-facing interactive chatbot.

Reads from:
  - Student DB  (chat history, preset questions)
  - Faculty DB  (lecture materials)

Conversation flow:
  1. Begin with preset questions for the current lecture
  2. After each answer, engage in follow-up discussion
  3. Once all preset Qs are done, switch to free-form mode
  4. In free-form mode, student picks lecture topics to explore
  5. Session conversation is returned for the caller to persist
"""

from __future__ import annotations

import logging

from openai import AsyncOpenAI

from app.config import OPENAI_API_KEY, OPENAI_MODEL

log = logging.getLogger("advi.agent")
from app.db import student_db, faculty_db
from app.models import ChatMessage, PresetQuestion, LectureMaterial
from .prompts import (
    AGENT_SYSTEM_PROMPT,
    AGENT_LECTURE_CONTEXT_TEMPLATE,
    AGENT_PRESET_INTRO,
    AGENT_PRESET_TRANSITION,
)

_client = AsyncOpenAI(api_key=OPENAI_API_KEY)


def _format_lectures(lectures: list[LectureMaterial]) -> str:
    parts = []
    for lec in lectures:
        parts.append(f"## {lec.title} (ID: {lec.lecture_id})\n{lec.content}")
    return "\n\n".join(parts)


def _build_system_messages(lectures: list[LectureMaterial]) -> list[dict]:
    lecture_block = AGENT_LECTURE_CONTEXT_TEMPLATE.format(
        lectures=_format_lectures(lectures)
    )
    return [
        {"role": "system", "content": AGENT_SYSTEM_PROMPT},
        {"role": "system", "content": lecture_block},
    ]


class ChatAgent:
    """Manages a single student chat session against the OpenAI API."""

    def __init__(self, student_id: str, lecture_id: str) -> None:
        self.student_id = student_id
        self.lecture_id = lecture_id

        self._preset_questions: list[PresetQuestion] = (
            student_db.get_preset_questions(lecture_id)
        )
        self._preset_index = self._compute_starting_index()
        self._session_messages: list[ChatMessage] = []

        lecture = faculty_db.get_lecture(lecture_id)
        self._lectures = [lecture] if lecture else []
        self._system_msgs = _build_system_messages(self._lectures)

    # --- Public API ---

    async def start_session(self) -> tuple[str, PresetQuestion | None, bool]:
        """
        Initialize a session. Returns the greeting + the first unanswered
        preset question (if any).
        """
        if not self._preset_questions:
            greeting = (
                "Hey! It looks like there are no preset questions for this "
                "lecture yet. Feel free to ask me anything about the material!"
            )
            return greeting, None, True

        if self._preset_index >= len(self._preset_questions):
            return AGENT_PRESET_TRANSITION, None, True

        lecture_title = (
            self._lectures[0].title if self._lectures else self.lecture_id
        )
        intro = AGENT_PRESET_INTRO.format(
            lecture_title=lecture_title,
            count=len(self._preset_questions),
        )
        first_q = self._preset_questions[self._preset_index]
        greeting = f"{intro}\n\n**Question {self._preset_index + 1} of {len(self._preset_questions)}:**\n{first_q.question}"

        self._record("assistant", greeting)
        return greeting, first_q, False

    async def handle_message(
        self, user_message: str
    ) -> tuple[str, PresetQuestion | None, bool]:
        """
        Process a student message. Returns (reply, next_question_or_none, preset_complete).
        """
        self._record("user", user_message)

        in_preset = self._preset_index < len(self._preset_questions)

        if in_preset:
            reply = await self._handle_preset_answer(user_message)
        else:
            reply = await self._handle_freeform(user_message)

        self._record("assistant", reply)

        preset_complete = self._preset_index >= len(self._preset_questions)
        next_q = None

        if in_preset and preset_complete:
            transition = f"\n\n{AGENT_PRESET_TRANSITION}"
            reply += transition

        if in_preset and not preset_complete:
            next_q = self._preset_questions[self._preset_index]

        return reply, next_q, preset_complete

    async def handle_freeform(
        self, message: str, lecture_ids: list[str]
    ) -> str:
        """Handle a free-form question grounded in specific lectures."""
        log.info(
            "[ChatAgent:freeform] student=%s  lectures=%s  question=%r",
            self.student_id,
            lecture_ids,
            message,
        )
        extra_lectures = faculty_db.get_lectures(lecture_ids)
        all_lectures = {l.lecture_id: l for l in self._lectures + extra_lectures}
        system_msgs = _build_system_messages(list(all_lectures.values()))

        self._record("user", message)
        reply = await self._call_openai(system_msgs)
        self._record("assistant", reply)
        return reply

    def get_session_messages(self) -> list[ChatMessage]:
        return list(self._session_messages)

    def save_session(self) -> None:
        """Persist session conversation into the Student DB."""
        student_db.append_messages(self.student_id, self._session_messages)

    # --- Internals ---

    def _compute_starting_index(self) -> int:
        """Resume from where the student left off based on stored responses."""
        record = student_db.get_student(self.student_id)
        answered_ids = set(record.preset_responses.keys())
        for i, q in enumerate(self._preset_questions):
            if q.id not in answered_ids:
                return i
        return len(self._preset_questions)

    async def _handle_preset_answer(self, user_message: str) -> str:
        current_q = self._preset_questions[self._preset_index]

        context_instruction = {
            "role": "system",
            "content": (
                f"The student is answering preset question {self._preset_index + 1}: "
                f'"{current_q.question}" (concept: {current_q.concept}). '
                "Evaluate their answer, give feedback, and if their understanding "
                "seems solid, acknowledge it and move on. If not, ask a brief "
                "follow-up to guide them."
            ),
        }
        custom_system = self._system_msgs + [context_instruction]
        reply = await self._call_openai(custom_system)

        student_db.save_preset_response(
            self.student_id,
            current_q.id,
            [
                ChatMessage(role="user", content=user_message),
                ChatMessage(role="assistant", content=reply),
            ],
        )
        self._preset_index += 1
        return reply

    async def _handle_freeform(self, user_message: str) -> str:
        return await self._call_openai(self._system_msgs)

    async def _call_openai(self, system_msgs: list[dict]) -> str:
        history = [
            {"role": m.role, "content": m.content}
            for m in self._session_messages
        ]
        prior = [
            {"role": m.role, "content": m.content}
            for m in student_db.get_chat_history(self.student_id)[-20:]
        ]

        messages = system_msgs + prior + history

        response = await _client.chat.completions.create(
            model=OPENAI_MODEL,
            messages=messages,
            temperature=0.7,
            max_tokens=1024,
        )
        usage = response.usage
        log.info(
            "[ChatAgent] model=%s  prompt_tokens=%d  completion_tokens=%d  total_tokens=%d",
            response.model,
            usage.prompt_tokens,
            usage.completion_tokens,
            usage.total_tokens,
        )
        return response.choices[0].message.content or ""

    def _record(self, role: str, content: str) -> None:
        self._session_messages.append(ChatMessage(role=role, content=content))
