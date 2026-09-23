"use client";

import BoutiqueServiceLandingClient from "@/components/BoutiqueServiceLandingClient";

/** @deprecated Prefer BoutiqueServiceLandingClient with slug="blouse" */
export default function BlouseLandingClient(props) {
  return <BoutiqueServiceLandingClient slug="blouse" {...props} />;
}
