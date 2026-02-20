"""
AdvI LLM API — faculty-facing analytics engine.

Reads from:
  - Faculty DB  (lecture notes)
  - Student DB  (all chat histories)

Produces:
  1. Faculty insights — how well students understand each concept
  2. Suggested preset questions — written back to Student DB
"""

from __future__ import annotations

import json
import logging

from openai import AsyncOpenAI

from app.config import OPENAI_API_KEY, OPENAI_MODEL

log = logging.getLogger("advi.llm_api")
from app.db import student_db, faculty_db
from app.models import (
    ChatMessage,
    PresetQuestion,
    FacultyInsight,
    LectureMaterial,
)
from .prompts import LLM_API_INSIGHT_PROMPT, LLM_API_QUESTION_GEN_PROMPT

_client = AsyncOpenAI(api_key=OPENAI_API_KEY)


def _format_lectures(lectures: list[LectureMaterial]) -> str:
    return "\n\n".join(
        f"## {l.title} (ID: {l.lecture_id})\n{l.content}" for l in lectures
    )


def _format_histories(histories: dict[str, list[ChatMessage]]) -> str:
    parts = []
    for sid, msgs in histories.items():
        convo = "\n".join(f"  {m.role}: {m.content}" for m in msgs[-30:])
        parts.append(f"### Student {sid}\n{convo}")
    return "\n\n".join(parts) if parts else "(no student conversations yet)"


class LLMApi:
    """Faculty-side analysis: insights + question generation."""

    def __init__(self, lecture_id: str) -> None:
        self.lecture_id = lecture_id

    async def generate_insights(self) -> list[FacultyInsight]:
        """Analyze student conversations and produce per-concept insights."""
        lecture = faculty_db.get_lecture(self.lecture_id)
        if not lecture:
            return []

        lectures_text = _format_lectures([lecture])
        histories_text = _format_histories(student_db.get_all_histories())

        messages = [
            {"role": "system", "content": LLM_API_INSIGHT_PROMPT},
            {
                "role": "user",
                "content": (
                    f"=== LECTURE MATERIAL ===\n{lectures_text}\n\n"
                    f"=== STUDENT CONVERSATIONS ===\n{histories_text}"
                ),
            },
        ]

        response = await _client.chat.completions.create(
            model=OPENAI_MODEL,
            messages=messages,
            temperature=0.4,
            max_tokens=2048,
        )
        usage = response.usage
        log.info(
            "[LLMApi:insights] model=%s  prompt_tokens=%d  completion_tokens=%d  total_tokens=%d",
            response.model,
            usage.prompt_tokens,
            usage.completion_tokens,
            usage.total_tokens,
        )

        raw = response.choices[0].message.content or "[]"
        try:
            data = json.loads(raw)
        except json.JSONDecodeError:
            return []

        insights = []
        for item in data:
            insights.append(
                FacultyInsight(
                    lecture_id=self.lecture_id,
                    concept=item.get("concept", ""),
                    struggling_pct=float(item.get("struggling_pct", 0)),
                    summary=item.get("summary", ""),
                    recommendation=item.get("recommendation", ""),
                )
            )
        return insights

    async def generate_preset_questions(
        self, count: int = 5
    ) -> list[PresetQuestion]:
        """Generate preset questions from lecture material and save to Student DB."""
        lecture = faculty_db.get_lecture(self.lecture_id)
        if not lecture:
            return []

        lectures_text = _format_lectures([lecture])

        messages = [
            {
                "role": "system",
                "content": LLM_API_QUESTION_GEN_PROMPT.format(count=count),
            },
            {
                "role": "user",
                "content": f"=== LECTURE MATERIAL ===\n{lectures_text}",
            },
        ]

        response = await _client.chat.completions.create(
            model=OPENAI_MODEL,
            messages=messages,
            temperature=0.5,
            max_tokens=1024,
        )
        usage = response.usage
        log.info(
            "[LLMApi:questions] model=%s  prompt_tokens=%d  completion_tokens=%d  total_tokens=%d",
            response.model,
            usage.prompt_tokens,
            usage.completion_tokens,
            usage.total_tokens,
        )

        raw = response.choices[0].message.content or "[]"
        try:
            data = json.loads(raw)
        except json.JSONDecodeError:
            return []

        questions = []
        for item in data:
            questions.append(
                PresetQuestion(
                    id=item.get("id", ""),
                    lecture_id=self.lecture_id,
                    question=item.get("question", ""),
                    concept=item.get("concept", ""),
                )
            )

        student_db.set_preset_questions(self.lecture_id, questions)
        return questions
