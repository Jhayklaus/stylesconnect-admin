// Per-resource kill switch for the fixture layer.
//
// While a resource is mocked, its api functions resolve from `*.mock.ts`
// instead of hitting the network. When a real endpoint ships, flip that one
// flag to false, verify the payload matches the declared type, then delete
// the fixture file. Nothing above the service layer changes.
const ALL_MOCKS = process.env.NEXT_PUBLIC_USE_MOCKS !== "false";

export const MOCKS = {
  auth: ALL_MOCKS,
  overview: ALL_MOCKS,
  designers: ALL_MOCKS,
  shoppers: ALL_MOCKS,
  listings: ALL_MOCKS,
  orders: ALL_MOCKS,
  payments: ALL_MOCKS,
  members: ALL_MOCKS,
  returns: ALL_MOCKS,
  refunds: ALL_MOCKS,
  tickets: ALL_MOCKS,
} as const;
