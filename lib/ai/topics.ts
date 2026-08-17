import type { AITrack, Topic } from "./types";
import t01 from "@/data/ai/topics/01-math.json";
import t02 from "@/data/ai/topics/02-data.json";
import t03 from "@/data/ai/topics/03-python.json";
import t04 from "@/data/ai/topics/04-what-is-ml.json";
import t05 from "@/data/ai/topics/05-regression-classification.json";
import t06 from "@/data/ai/topics/06-overfitting.json";
import t07 from "@/data/ai/topics/07-metrics.json";
import t08 from "@/data/ai/topics/08-neural-networks.json";
import t09 from "@/data/ai/topics/09-cnn-rnn.json";
import t10 from "@/data/ai/topics/10-transformers.json";
import t11 from "@/data/ai/topics/11-how-llms-work.json";
import t12 from "@/data/ai/topics/12-prompt-engineering.json";
import t13 from "@/data/ai/topics/13-embeddings.json";
import t14 from "@/data/ai/topics/14-rag.json";
import t15 from "@/data/ai/topics/15-fine-tuning.json";
import t16 from "@/data/ai/topics/16-agents.json";
import t17 from "@/data/ai/topics/17-eval-guardrails.json";
import t18 from "@/data/ai/topics/18-deploy-ops.json";
import t19 from "@/data/ai/topics/19-responsible-ai.json";

// Ordered — the roadmap is meant to be worked through top to bottom.
const topics = [
  t01, t02, t03, t04, t05, t06, t07, t08, t09, t10,
  t11, t12, t13, t14, t15, t16, t17, t18, t19,
] as unknown as Topic[];

export function getAllTopics(): Topic[] {
  return topics;
}

export function getAllTopicIds(): string[] {
  return topics.map((t) => t.id);
}

export function getTopicById(id: string): Topic | undefined {
  return topics.find((t) => t.id === id);
}

export function getTopicsByTrack(track: AITrack): Topic[] {
  return topics.filter((t) => t.track === track);
}
