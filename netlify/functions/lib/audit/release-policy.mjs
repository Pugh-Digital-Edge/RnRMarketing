// This release publishes the page and fictional example only. No production
// database, bot keys or staging evidence was configured/verified in this task.
// Environment flags alone cannot bypass this versioned server-side hold.
export const PUBLIC_AUDIT_RELEASE = Object.freeze({
  liveScanningAuthorized: false,
  reportDeliveryAuthorized: false,
});

export const PUBLIC_AUDIT_DISABLED = Object.freeze({
  enabled: false,
  reportEnabled: false,
  mode: 'disabled',
  message: 'Live website scans are not enabled yet. Explore the fictional sample report or book a call.',
});
