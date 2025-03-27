
import { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import { Agreement } from "@/types";
import { investorApi } from "@/services/api";
import { generateAgreementHtml } from "@/utils/pdfGenerator";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

const PdfViewer = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [agreement, setAgreement] = useState<Agreement | null>(null);
  const pdfContentRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  useEffect(() => {
    const fetchAgreement = async () => {
      try {
        setLoading(true);
        // Get agreement ID from URL query parameters
        const params = new URLSearchParams(location.search);
        const agreementId = params.get("agreementId");
        
        if (!agreementId) {
          throw new Error("No agreement ID provided");
        }
        
        // Fetch the agreement details
        const agreementData = await investorApi.getAgreementById(agreementId);
        setAgreement(agreementData);
        
        // Set the document title
        if (agreementData.idea) {
          document.title = `Agreement - ${agreementData.idea.title}`;
        }
        
        // Generate HTML content for the PDF and set it to the DOM
        // We'll use dangerouslySetInnerHTML instead of setting innerHTML directly
        if (pdfContentRef.current) {
          const htmlContent = generateAgreementHtml(
            agreementData, 
            agreementData.signatureData
          );
          
          // Log the HTML content to debug
          console.log("Generated HTML content:", htmlContent);
          
          // Set the HTML content
          pdfContentRef.current.innerHTML = htmlContent;
        }
      } catch (error) {
        console.error("Error fetching agreement:", error);
        toast({
          title: "Error",
          description: "Failed to load agreement",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchAgreement();
  }, [location.search, toast]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-lg">Loading agreement...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Add a debugging message to see if agreement data is loaded correctly */}
      {agreement && agreement.idea && (
        <div className="container mx-auto pt-4 px-4 text-sm text-gray-500">
          Agreement loaded: {agreement.idea.title} ({agreement.id})
        </div>
      )}
      
      {/* The PDF content container */}
      <div 
        id="pdf-content" 
        ref={pdfContentRef} 
        className="container mx-auto py-8"
      ></div>
      
      <div className="fixed bottom-4 right-4 flex gap-2">
        <button 
          className="bg-primary text-white px-4 py-2 rounded shadow hover:bg-primary/90 transition-colors"
          onClick={() => window.print()}
        >
          Print / Save as PDF
        </button>
        <button 
          className="bg-gray-200 text-gray-800 px-4 py-2 rounded shadow hover:bg-gray-300 transition-colors"
          onClick={() => window.close()}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default PdfViewer;
