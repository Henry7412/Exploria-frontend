export type LandingPackage = {
  _id: string;

  name: string | null;
  amount: number;
  credits: number;
  coin: "PEN" | string;

  // existe en schema (puede venir en response si no lo filtras)
  disable?: boolean;
};

export type LandingPackagesResponse = {
  items: LandingPackage[];
};

export type CreditsRequestPayload = {
  package: string; // id del package
};

export type CreditsRequestResponse = {
  orderCode: string;
};
