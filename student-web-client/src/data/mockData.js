export const student = {
  name: "Alex Johnson",
  initials: "A",
  course: "CS 4501 – Intro to AI/ML",
};

export const presetQuestions = [
  { id: 1, text: "Explain the difference between LoRA and full fine-tuning." },
  { id: 2, text: "What is catastrophic forgetting?" },
  { id: 3, text: "How do you select hyperparameters for fine-tuning?" },
  { id: 4, text: "Describe the data preparation pipeline for instruction-tuning." },
  { id: 5, text: "When should you choose fine-tuning over prompting?" },
];

export const lectureTopics = [
  { id: 1, label: "Lec 1 – Intro to ML" },
  { id: 5, label: "Lec 5 – Neural Nets" },
  { id: 8, label: "Lec 8 – Transformers" },
  { id: 10, label: "Lec 10 – Fine-Tuning" },
  { id: 11, label: "Lec 11 – RAG" },
  { id: 12, label: "Lec 12 – AI Ethics" },
];

export const keyConcepts = [
  { label: "Tokenization", status: "strong" },
  { label: "Transfer Learning", status: "strong" },
  { label: "Prompt Templates", status: "partial" },
  { label: "Hyperparameters", status: "weak" },
  { label: "Catastrophic Forgetting", status: "weak" },
  { label: "LoRA Trade-offs", status: "weak" },
];

export const confidenceBars = [
  { label: "LoRA", pct: 82, color: "var(--success)" },
  { label: "Forgetting", pct: 65, color: "var(--warning)" },
  { label: "Hyperparams", pct: 20, color: "var(--danger)" },
  { label: "Data Prep", pct: 10, color: "#CBD5E1" },
];

export const initialMessages = [
  {
    role: "ai",
    presetLabel: null,
    text: 'Hey Alex! 👋 Welcome back. We\'re working through <strong>Lecture 10 – Fine-Tuning LLMs</strong> today. I have 5 questions to help check your understanding, and then we can dive into anything you\'d like to explore further. Ready to get started?',
    time: "2:30 PM",
  },
  {
    role: "student",
    text: "Yes, let's do it!",
    time: "2:30 PM",
  },
  {
    role: "ai",
    presetLabel: "Preset Question 1 of 5",
    text: "<strong>Can you explain the key differences between LoRA fine-tuning and full-parameter fine-tuning?</strong> Think about when you might choose one approach over the other.",
    time: "2:31 PM",
  },
  {
    role: "student",
    text: "LoRA only trains small adapter matrices added to the attention layers, while full fine-tuning updates all model parameters. LoRA uses less memory and is faster, but full fine-tuning might give better results for very different domains. I'd use LoRA for most cases since it's efficient.",
    time: "2:33 PM",
  },
  {
    role: "ai",
    presetLabel: null,
    text: "Great answer! You've captured the core trade-off well. One small addition — LoRA's \"rank\" parameter controls how expressive those adapters are. A higher rank means more parameters but better capacity. Could you think of a scenario where LoRA with a <em>high rank</em> might still be preferred over full fine-tuning?",
    time: "2:33 PM",
  },
  {
    role: "student",
    text: "Maybe when you have limited GPU memory but still want strong adaptation? High-rank LoRA gives you more capacity without the full memory cost of updating every parameter.",
    time: "2:34 PM",
  },
  {
    role: "ai",
    presetLabel: null,
    text: "Exactly right! ✅ That's a solid understanding of LoRA. Let's move on to the next question.",
    time: "2:34 PM",
  },
  {
    role: "ai",
    presetLabel: "Preset Question 2 of 5",
    text: "<strong>What is catastrophic forgetting, and what strategies can be used to mitigate it during fine-tuning?</strong>",
    time: "2:35 PM",
  },
  {
    role: "student",
    text: "Catastrophic forgetting is when a model loses its general abilities after being fine-tuned on a specific task. You can mitigate it by using a lower learning rate, or maybe regularization techniques? I'm not totally sure about the specifics.",
    time: "2:37 PM",
  },
  {
    role: "ai",
    presetLabel: null,
    text: "You're on the right track! Lower learning rates do help. The specific regularization technique you might be thinking of is <strong>Elastic Weight Consolidation (EWC)</strong> — it identifies which weights were important for previous tasks and penalizes changing them. Another approach is <strong>mixed-task training</strong>, where you include some of the original training data alongside your new data. Does that help clarify things?",
    time: "2:37 PM",
  },
  {
    role: "student",
    text: "Yes! EWC makes sense — protect the important weights. And mixing data is clever. Got it, thanks!",
    time: "2:38 PM",
  },
  {
    role: "ai",
    presetLabel: null,
    text: "Great recovery! ✅ You've got a solid grasp now. Let's keep the momentum going.",
    time: "2:38 PM",
  },
  {
    role: "ai",
    presetLabel: "Preset Question 3 of 5",
    text: "<strong>How would you approach selecting hyperparameters — specifically learning rate, batch size, and number of epochs — when fine-tuning a pre-trained model?</strong> What factors would influence your choices?",
    time: "2:39 PM",
  },
];

export const aiResponses = [
  "That's an interesting perspective! When selecting hyperparameters for fine-tuning, consider that <strong>learning rate</strong> should typically be 10-100x smaller than pre-training (e.g., 1e-5 to 5e-5). <strong>Batch size</strong> depends on GPU memory — smaller batches add noise that can help generalization. And <strong>epochs</strong> should be kept low (2-5) to avoid overfitting on your fine-tuning data. Would you like to explore any of these in more detail?",
  "Great question! The key insight is that fine-tuning requires a balance between adapting to new data and retaining the model's pre-trained knowledge. Think of it like adjusting a recipe — small changes can have a big impact. What specific aspect would you like to dig deeper into?",
  "That's a thoughtful approach. One thing to keep in mind is that the optimal hyperparameters often depend on your dataset size. With smaller datasets, lower learning rates and fewer epochs help prevent overfitting. With larger datasets, you have more room to experiment. Want me to walk through a concrete example?",
  "Interesting! You're building a good mental model here. Remember that hyperparameter tuning isn't just trial and error — techniques like learning rate schedulers (warmup + decay) can automate part of the process. Shall we move on to the next question, or would you like to explore this further?",
];
