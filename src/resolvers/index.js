import { merge } from "lodash";
import movieResolver from "./movie.resolver";

export const resolvers = merge(movieResolver);
