// Per-resource kill switch for the fixture layer.
//
// While a resource is mocked, its api functions resolve from `*.mock.ts`
// instead of hitting the network. NEXT_PUBLIC_USE_MOCKS=true still puts the
// whole app back on fixtures; resources with no backend endpoint yet stay
// mocked regardless. When one ships, point its flag at ALL_MOCKS, verify the
// payload matches the declared type, then delete the fixture file.
const ALL_MOCKS = process.env.NEXT_PUBLIC_USE_MOCKS === "true";

export const MOCKS = {
  auth: ALL_MOCKS,
  overview: ALL_MOCKS,
  designers: ALL_MOCKS,
  shoppers: ALL_MOCKS,
  listings: ALL_MOCKS,
  orders: ALL_MOCKS,
  payments: ALL_MOCKS,
  members: ALL_MOCKS,
  attributes: ALL_MOCKS,
  // No backend endpoints yet.
  returns: true,
  refunds: true,
  tickets: true,
} as const;
