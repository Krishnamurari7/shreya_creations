import { z } from "zod";
import { BUSINESS_TYPES, EMPLOYMENT_TYPES, EXPERIENCE_OPTIONS, HIRING_TERMS_VERSION, INDIAN_STATES, STAFF_ROLES, WORKPLACE_TYPES } from "./hiring";

const required = (max = 200) => z.string().trim().min(1, "This field is required.").max(max);
const optional = (max = 200) => z.string().trim().max(max).optional().default("");
const phone = z.string().trim().regex(/^(?:\+?91[\s-]?)?[6-9]\d{9}$/, "Enter a valid Indian mobile number.");
const money = z.union([z.literal(""), z.number().int().min(0).max(10000000)]);

export const hiringSchema = z.object({
  idempotencyKey: z.string().uuid(),
  companyName: required(), businessType: z.enum(BUSINESS_TYPES), businessTypeOther: optional(),
  contactName: required(), ownerName: optional(), mobile: phone, whatsapp: z.union([z.literal(""), phone]),
  email: z.union([z.literal(""), z.email().max(254)]), website: z.union([z.literal(""), z.url().max(500)]),
  businessAddress: required(1000), businessState: z.enum(INDIAN_STATES), businessCity: required(100),
  pinCode: z.string().regex(/^\d{6}$/, "Enter a 6-digit PIN code."),
  positions: z.array(z.object({
    role: z.enum(STAFF_ROLES), customRole: optional(), quantity: z.number().int().min(1).max(1000),
    experience: z.enum(EXPERIENCE_OPTIONS), skills: optional(1000),
    salaryMin: money, salaryMax: money, negotiable: z.boolean(),
  }).superRefine((p, ctx) => {
    if (p.role === "Other" && !p.customRole) ctx.addIssue({ code: "custom", path: ["customRole"], message: "Enter the position name." });
    if (p.salaryMin !== "" && p.salaryMax !== "" && p.salaryMin > p.salaryMax) ctx.addIssue({ code: "custom", path: ["salaryMax"], message: "Maximum salary must be at least the minimum." });
  })).min(1).max(20),
  workAddress: required(1000), workState: z.enum(INDIAN_STATES), workCity: required(100),
  workplaceType: z.enum(WORKPLACE_TYPES), workplaceTypeOther: optional(),
  employmentType: z.enum(EMPLOYMENT_TYPES), joiningDate: z.iso.date(),
  workingHours: required(200), weeklyOff: required(200), accommodation: z.boolean(), food: z.boolean(),
  benefits: optional(1000), details: optional(5000),
  consentAccuracy: z.literal(true), consentTerms: z.literal(true), consentContact: z.literal(true),
  termsVersion: z.literal(HIRING_TERMS_VERSION), websiteTrap: z.string().max(200).optional().default(""),
}).superRefine((data, ctx) => {
  if (data.businessType === "Other" && !data.businessTypeOther) ctx.addIssue({ code: "custom", path: ["businessTypeOther"], message: "Describe the business type." });
  if (data.workplaceType === "Other" && !data.workplaceTypeOther) ctx.addIssue({ code: "custom", path: ["workplaceTypeOther"], message: "Describe the workplace type." });
  if (data.positions.reduce((sum, p) => sum + p.quantity, 0) > 10000) ctx.addIssue({ code: "custom", path: ["positions"], message: "Total staff must be at most 10,000." });
});
