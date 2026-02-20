import { getLectures, uploadLecture, generateQuestions } from "./api";

const SEED_LECTURE = {
  lectureId: "lec10",
  title: "Fine-Tuning LLMs",
  content: `This lecture covers fine-tuning large language models (LLMs).

Key Topics:

1) LoRA (Low-Rank Adaptation) — Instead of updating all model parameters, LoRA trains small adapter matrices inserted into attention layers. The "rank" parameter controls the capacity of these adapters. Benefits: dramatically lower memory usage, faster training, ability to store multiple task-specific adapters.

2) Full Fine-Tuning — Updates every weight in the model. Best for large domain shifts where the pre-trained model's knowledge is insufficient. Drawback: requires significant compute, risk of overfitting on small datasets.

3) Catastrophic Forgetting — When fine-tuning overwrites the model's general knowledge. The model "forgets" how to do tasks it previously handled well. Mitigation strategies: Elastic Weight Consolidation (EWC) which protects important weights, using lower learning rates, and mixed-task training where you include original training data.

4) Hyperparameter Selection — For fine-tuning, use learning rates of 1e-5 to 5e-5 (10-100x smaller than pre-training). Keep epochs low (2-5) to avoid overfitting. Batch size depends on GPU memory; smaller batches add regularization noise.

5) Data Preparation — Instruction-tuning requires data in system/user/assistant format. Steps: raw data cleaning, prompt template construction, proper tokenization. The quality and format of your fine-tuning data has more impact than quantity.`,
};

export async function ensureSeeded() {
  try {
    const lectures = await getLectures();
    const exists = lectures.some((l) => l.lecture_id === SEED_LECTURE.lectureId);
    if (exists) return true;
  } catch {
    // backend might not be running
    return false;
  }

  try {
    await uploadLecture(
      SEED_LECTURE.lectureId,
      SEED_LECTURE.title,
      SEED_LECTURE.content
    );
    await generateQuestions(SEED_LECTURE.lectureId, 3);
    return true;
  } catch {
    return false;
  }
}
