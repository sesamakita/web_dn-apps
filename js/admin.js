// ============================================
// Admin Utilities - Shared Logic
// ============================================

/**
 * Upload a file to Supabase Storage and return the public URL
 * @param {File} file - The file to upload
 * @param {string} bucket - Bucket name (default: 'content')
 * @param {string} folder - Optional folder path
 * @returns {Promise<string|null>} Public URL or null if failed
 */
async function uploadImage(file, bucket = 'content', folder = 'images') {
    try {
        if (!file) return null;

        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.floor(Math.random() * 1000)}.${fileExt}`;
        const filePath = folder ? `${folder}/${fileName}` : fileName;

        console.log(`Uploading to ${bucket}/${filePath}...`);

        const { data, error } = await supabaseClient.storage
            .from(bucket)
            .upload(filePath, file);

        if (error) {
            console.error('Upload error:', error);
            throw error;
        }

        // Get public URL
        const { data: { publicUrl } } = supabaseClient.storage
            .from(bucket)
            .getPublicUrl(filePath);

        return publicUrl;
    } catch (err) {
        console.error('Failed to upload image:', err.message);
        alert('Gagal mengunggah gambar: ' + err.message);
        return null;
    }
}

// Export to window
window.uploadImage = uploadImage;
