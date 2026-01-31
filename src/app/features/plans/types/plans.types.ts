export type LandingPlan = {
  _id: string;
  name: "PLAN_FREE" | "PLAN_WEEKLY" | "PLAN_MONTHLY" | string;
  amount: number;
  discount: number;
  credits: number;
  period: "WEEKLY" | "MONTHLY" | string;
  duration: number;
  annual: boolean;
  coin: string;
  client: string;
};

export type LandingPlansResponse = {
  data: {
    user: LandingPlan[];
  };
};

export type PlanUserRequestPayload = {
  plan: string; // ObjectId
  annual: boolean;
};

export type PlanUserRequestResponse = {
  orderCode: string;
};
