"use client";

import SwaggerUI from "swagger-ui-react";
import "swagger-ui-react/swagger-ui.css";

type Props = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  readonly spec: Record<string, any>;
};

export default function ReactSwagger({ spec }: Props) {
  return <SwaggerUI spec={spec} />;
}
