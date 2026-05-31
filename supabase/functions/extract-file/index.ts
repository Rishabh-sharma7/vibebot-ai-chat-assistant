import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface ExtractRequest {
  filePath: string;
  sessionId: string;
  filename: string;
  fileType: string;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const { filePath, sessionId, filename, fileType }: ExtractRequest = await req.json();

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { data: fileData, error: downloadError } = await supabase.storage
      .from('chat-files')
      .download(filePath);

    if (downloadError) {
      throw new Error(`Failed to download file: ${downloadError.message}`);
    }

    const arrayBuffer = await fileData.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);

    let extractedText = "";

    if (fileType === "pdf") {
      extractedText = await extractPdfText(uint8Array);
    } else if (fileType === "ppt" || fileType === "pptx") {
      extractedText = await extractPptText(uint8Array);
    }

    const { error: insertError } = await supabase
      .from('uploaded_files')
      .insert({
        session_id: sessionId,
        filename,
        file_type: fileType,
        file_path: filePath,
        extracted_text: extractedText,
      });

    if (insertError) {
      throw new Error(`Failed to save file info: ${insertError.message}`);
    }

    return new Response(
      JSON.stringify({ success: true, extractedText }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Extract error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "An error occurred" }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});

async function extractPdfText(data: Uint8Array): Promise<string> {
  try {
    const textDecoder = new TextDecoder('utf-8', { fatal: false });
    const text = textDecoder.decode(data);

    const textMatches = text.match(/\(([^)]+)\)/g);
    if (textMatches) {
      return textMatches
        .map(match => match.slice(1, -1))
        .join(' ')
        .replace(/\\[nrt]/g, ' ')
        .trim();
    }

    return "PDF content detected but text extraction requires additional processing.";
  } catch (error) {
    console.error("PDF extraction error:", error);
    return "Failed to extract PDF text";
  }
}

async function extractPptText(_data: Uint8Array): Promise<string> {
  return "PowerPoint content detected. For full text extraction, additional processing is required.";
}
