import { merge } from "lodash";
import answerResolver from "./answer.resolver";

export const resolvers = merge(answerResolver);
