DO $$
BEGIN
  -- Hibernate won't update old CHECK constraints created previously.
  -- Ensure `notifications.type` accepts all current ENotificationType values.
  IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'notifications_type_check') THEN
    ALTER TABLE notifications DROP CONSTRAINT notifications_type_check;
  END IF;

  ALTER TABLE notifications
    ADD CONSTRAINT notifications_type_check
    CHECK (
      type IN (
        'APPLICATION_ACCEPTED',
        'APPLICATION_REJECTED',
        'NEW_APPLICATION',
        'JOB_APPROVED',
        'JOB_REJECTED',
        'WITHDRAWAL_REQUESTED',
        'WITHDRAWAL_APPROVED',
        'WITHDRAWAL_REJECTED',
        'JOB_CANCELLED',
        'WORK_SUBMITTED',
        'WORK_APPROVED',
        'WORK_REVISION_REQUESTED',
        'PAYMENT_RELEASED',
        'JOB_COMPLETED',
        'WORK_SUBMISSION_TIMEOUT',
        'WORK_REVIEW_TIMEOUT',
        'JOB_REOPENED',
        'DISPUTE_CREATED',
        'DISPUTE_RESPONSE_REQUESTED',
        'DISPUTE_RESPONSE_SUBMITTED',
        'DISPUTE_RESOLVED_WIN',
        'DISPUTE_RESOLVED_LOSE',
        'CHAT_REQUEST_RECEIVED',
        'CHAT_REQUEST_ACCEPTED',
        'CHAT_REQUEST_REJECTED',
        'CHAT_BLOCKED',
        'DEPOSIT_PAID',
        'CREDIT_ADMIN_GRANTED',
        'CREDIT_DAILY_GRANTED',
        'CREDIT_PURCHASED',
        'CREDIT_SPENT',
        'SYSTEM'
      )
    );
EXCEPTION
  WHEN undefined_table THEN
    -- first boot: table not created yet (will be created by Hibernate)
    NULL;
  WHEN duplicate_object THEN
    -- constraint already exists (concurrent init or already applied)
    NULL;
END
$$;

