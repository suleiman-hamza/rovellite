-- ============================================================================
-- Rovellite Wallet Platform — CoralPay Production-Style Test Data Seeding
-- ============================================================================
-- Run this script in your PostgreSQL editor or Supabase SQL editor to seed
-- actual CoralPay sandbox plans with valid metadata into subscription_plans.
-- ============================================================================

-- Create 'db' directory if running manually

-- 1. Insert Actual CoralPay Subscription Plans with Metadata
INSERT INTO subscription_plans (id, name, price, service_provider, is_active, metadata, created_at, updated_at)
VALUES 
  (
    '11111111-1111-4111-8111-111111111111', 
    'IKEDC Prepaid Electricity', 
    10000.00, 
    'CORALPAY', 
    true, 
    '{"coralpay": {"packageSlug": "IKEDC_PREPAID", "billerSlug": "IKEDC"}}'::jsonb,
    now(), 
    now()
  ),
  (
    '22222222-2222-4222-8222-222222222222', 
    'DStv Compact Package', 
    10500.00, 
    'CORALPAY', 
    true, 
    '{"coralpay": {"packageSlug": "COMPACT", "billerSlug": "DSTV"}}'::jsonb,
    now(), 
    now()
  )
ON CONFLICT (id) DO UPDATE 
SET name = EXCLUDED.name,
    price = EXCLUDED.price,
    service_provider = EXCLUDED.service_provider,
    is_active = EXCLUDED.is_active,
    metadata = EXCLUDED.metadata,
    updated_at = now();

