import { merge } from "lodash";
import answerResolver from "./answer.resolver";
import movieResolver from "./movie.resolver";

export const resolvers = merge(answerResolver, movieResolver);
