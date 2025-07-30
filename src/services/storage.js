
// services/storage.js

export async function uploadPdfToGoogleDrive(file, title, accessToken) {
  if (!file) {
    throw new Error('No file selected for upload.');
  }
  if (file.type !== 'application/pdf') {
    throw new Error('Only PDF files are allowed.');
  }
  if (!accessToken) {
    throw new Error('Google Drive authentication token is missing.');
  }

  try {
    // --- Step 1: Start a resumable upload session to get the upload URL ---
    const metadata = {
      name: `${title}.pdf`, // The name of the file in Google Drive
      mimeType: 'application/pdf',
      // You can specify a folder ID here to upload to a specific folder
      // parents: ['YOUR_FOLDER_ID_HERE'] 
    };

    const createResponse = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=resumable&fields=id,webViewLink', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json; charset=UTF-8',
      },
      body: JSON.stringify(metadata),
    });

    if (!createResponse.ok) {
      const errorData = await createResponse.json();
      console.error('Google Drive API Error (Metadata):', errorData);
      throw new Error(`Failed to create file metadata in Google Drive: ${errorData.error.message}`);
    }

    const location = createResponse.headers.get('Location'); // The resumable upload URL

    // --- Step 2: Upload the actual file content to the received URL ---
    const uploadResponse = await fetch(location, {
      method: 'PUT',
      headers: {
        'Content-Range': `bytes 0-${file.size - 1}/${file.size}`,
      },
      body: file,
    });

    if (!uploadResponse.ok) {
        const errorData = await uploadResponse.json();
        console.error('Google Drive API Error (Upload):', errorData);
        throw new Error(`Failed to upload file to Google Drive: ${errorData.error.message}`);
    }

    const result = await uploadResponse.json();
    
    // --- Step 3: (Optional but recommended) Make the file publicly readable ---
    // By default, files are private. We need to change permissions to make them viewable.
    await fetch(`https://www.googleapis.com/drive/v3/files/${result.id}/permissions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        role: 'reader',
        type: 'anyone',
      }),
    });


    return result;

  } catch (error) {
    // Re-throw or wrap the error to be caught by the calling component
    throw new Error(`Google Drive upload process failed: ${error.message}`);
  }
}
