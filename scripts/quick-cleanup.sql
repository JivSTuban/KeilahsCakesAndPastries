-- Quick cleanup script for placeholder feedback
-- Run this in your Supabase SQL editor to remove all placeholder feedback

-- First, let's see what we're going to delete (optional - for review)
SELECT id, customer_name, message, created_at 
FROM feedback 
WHERE 
  customer_name IN ('Still Jiv', 'Jiv Tuban', 'asd', 'test') 
  OR message IN ('I love mango graham bars too', 'I love the mango cakes', 'asd', 'ad')
  OR (LENGTH(COALESCE(message, '')) < 5 AND message IS NOT NULL AND message != '')
ORDER BY created_at DESC;

-- Now delete the placeholder entries
DELETE FROM feedback 
WHERE 
  customer_name IN ('Still Jiv', 'Jiv Tuban', 'asd', 'test') 
  OR message IN ('I love mango graham bars too', 'I love the mango cakes', 'asd', 'ad')
  OR (LENGTH(COALESCE(message, '')) < 5 AND message IS NOT NULL AND message != '');

-- Show remaining feedback count
SELECT COUNT(*) as remaining_feedback_count FROM feedback;
