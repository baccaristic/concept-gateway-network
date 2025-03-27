
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Idea, Agreement } from "@/types";
import { investorApi } from "@/services/api";
import { generateAgreementHtml } from "@/utils/pdfGenerator";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

const PdfViewer = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [agreement, setAgreement] = useState<Agreement | null>(null);
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
        
        // Generate and insert HTML content
        const htmlContent = generateAgreementHtml(
          agreementData, 
          agreementData.signatureData
        );
        document.getElementById("pdf-content")!.innerHTML = htmlContent;
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
      <div id="pdf-content" className="container mx-auto py-8"></div>
      
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
