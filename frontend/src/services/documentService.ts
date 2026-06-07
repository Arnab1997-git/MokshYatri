import { supabase } from "@/lib/supabase";

export async function uploadBookingDocument(
  bookingId: number,
  file: File,
  title: string
) {

  const fileName =
    `${bookingId}-${Date.now()}-${file.name}`;

  const { error: uploadError } =
    await supabase.storage
      .from(
        "booking-documents"
      )
      .upload(
        fileName,
        file
      );

  if (uploadError) {

    console.error(
      uploadError
    );

    return {
      success: false,
    };
  }

  const {
    data: publicUrlData,
  } =
    supabase.storage
      .from(
        "booking-documents"
      )
      .getPublicUrl(
        fileName
      );

  const fileUrl =
    publicUrlData.publicUrl;

  const {
    data: { user },
  } =
    await supabase.auth.getUser();

  const {
    error,
  } = await supabase
    .from(
      "booking_documents"
    )
    .insert([{

      booking_id:
        bookingId,

      title,

      file_url:
        fileUrl,

      uploaded_by:
        user?.id,

    }]);

  if (error) {

    console.error(error);

    return {
      success: false,
    };
  }

  return {
    success: true,
  };
}

export async function getBookingDocuments(
  bookingId: number
) {

  const { data, error } =
    await supabase
      .from(
        "booking_documents"
      )
      .select("*")
      .eq(
        "booking_id",
        bookingId
      )
      .order(
        "created_at",
        {
          ascending: false,
        }
      );

  if (error) {

    console.error(error);

    return [];
  }

  return data || [];
}