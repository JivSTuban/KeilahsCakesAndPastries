import { supabase } from '@/lib/supabase';

/**
 * Remove placeholder/test feedback entries from the database
 */
async function cleanupPlaceholderFeedback() {
  try {
    console.log('Starting cleanup of placeholder feedback...');
    
    // Remove feedback with placeholder names
    const placeholderNames = [
      'Still Jiv',
      'Jiv Tuban', 
      'asd',
      'test',
      'Test User',
      'Test Customer',
      'Sample User'
    ];

    const { data: nameCleanup, error: nameError } = await supabase
      .from('feedback')
      .delete()
      .in('customer_name', placeholderNames);

    if (nameError) throw nameError;

    // Remove feedback with placeholder messages
    const placeholderMessages = [
      'I love mango graham bars too',
      'I love the mango cakes',
      'asd',
      'test',
      'This is a test',
      'Sample feedback',
      'ad'
    ];

    const { data: messageCleanup, error: messageError } = await supabase
      .from('feedback')
      .delete()
      .in('message', placeholderMessages);

    if (messageError) throw messageError;

    // Remove feedback with very short or empty messages
    const { data: shortMessageCleanup, error: shortError } = await supabase
      .from('feedback')
      .delete()
      .or('message.is.null,message.eq.,customer_name.eq.asd,customer_name.eq.test');

    if (shortError) throw shortError;

    console.log('Successfully cleaned up placeholder feedback entries');
    console.log('Cleanup completed!');
    
    return { success: true };
  } catch (error) {
    console.error('Error cleaning up placeholder feedback:', error);
    throw error;
  }
}

// Export for use in other scripts
export { cleanupPlaceholderFeedback };

// Uncomment to run this script
// cleanupPlaceholderFeedback();
