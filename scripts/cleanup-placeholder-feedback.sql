-- Script to remove placeholder/test feedback entries
-- This will remove feedback entries that appear to be test data

DELETE FROM feedback 
WHERE customer_name IN (
  'Still Jiv',
  'Jiv Tuban',
  'asd',
  'test',
  'Test User',
  'Test Customer',
  'Sample User'
) 
OR message IN (
  'I love mango graham bars too',
  'I love the mango cakes',
  'asd',
  'test',
  'This is a test',
  'Sample feedback'
)
OR (customer_name IS NULL AND message IS NULL)
OR (customer_name = '' AND message = '')
OR message LIKE '%test%'
OR message LIKE '%placeholder%'
OR customer_name LIKE '%test%'
OR customer_name LIKE '%placeholder%';

-- Also remove any feedback with very short or meaningless messages
DELETE FROM feedback 
WHERE LENGTH(COALESCE(message, '')) < 5 
   OR message IN ('ad', 'test', 'asd', 'asdf', '123', 'abc');

-- Remove feedback with obviously fake names
DELETE FROM feedback 
WHERE customer_name IN ('asd', 'test', 'asdf', '123', 'abc', 'qwe', 'zxc');
