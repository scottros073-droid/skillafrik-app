import axios from "../utils/axiosInstance";

export const fetchAICredits = async () => {
  try {
    const proposal = await axios.get("/ai/credits/proposal");
    const design = await axios.get("/ai/credits/design");
    const cv = await axios.get("/ai/credits/cv");

    return { 
      proposal: proposal.data, 
      design: design.data, 
      cv: cv.data 
    };
  } catch (err) {
    console.error("Failed to fetch AI Credits:", err);
  }
};

// Analyze a proposal and get improvement suggestions
export const analyzeProposal = async (proposal, jobTitle, jobDescription) => {
  try {
    const { data } = await axios.post("/ai/analyze/proposal", {
      proposal,
      jobTitle,
      jobDescription
    });
    return data;
  } catch (err) {
    console.error("Proposal analysis error:", err);
    throw err;
  }
};

/* ========================
   CV Builder - AI Generation
   ======================== */

// Generate CV preview (free) - get cvText + coverLetter
export const generateCVPreview = async (cvData) => {
  try {
    const { data } = await axios.post("/ai/cv/generate/preview", cvData);
    return data;
  } catch (err) {
    console.error("CV preview generation error:", err);
    throw err;
  }
};

// Save generated CV to user profile
export const saveCVToProfile = async (cvData) => {
  try {
    const { data } = await axios.post("/ai/cv/save", cvData);
    return data;
  } catch (err) {
    console.error("CV save error:", err);
    throw err;
  }
};

// Get all saved CVs for user
export const getSavedCVs = async () => {
  try {
    const { data } = await axios.get("/ai/cv/saved");
    return data;
  } catch (err) {
    console.error("Failed to fetch saved CVs:", err);
    throw err;
  }
};

// Generate PDF (premium only)
export const generateCVPDF = async (cvData) => {
  try {
    const { data } = await axios.post("/ai/cv/generate/cv", cvData, {
      responseType: "blob"
    });
    return data;
  } catch (err) {
    console.error("CV PDF generation error:", err);
    throw err;
  }
};

/* ========================
   Portfolio Builder - AI Assisted
   ======================== */

// Create new portfolio (free: 1 basic, premium: unlimited)
export const createPortfolio = async (portfolioData) => {
  try {
    const { data } = await axios.post("/portfolios", portfolioData);
    return data;
  } catch (err) {
    console.error("Error creating portfolio:", err);
    throw err;
  }
};

// Get all user's portfolios
export const getUserPortfolios = async () => {
  try {
    const { data } = await axios.get("/portfolios/my-portfolios");
    return data;
  } catch (err) {
    console.error("Error fetching portfolios:", err);
    throw err;
  }
};

// Get single portfolio
export const getPortfolioById = async (id) => {
  try {
    const { data } = await axios.get(`/portfolios/${id}`);
    return data;
  } catch (err) {
    console.error("Error fetching portfolio:", err);
    throw err;
  }
};

// Update portfolio
export const updatePortfolio = async (id, portfolioData) => {
  try {
    const { data } = await axios.put(`/portfolios/${id}`, portfolioData);
    return data;
  } catch (err) {
    console.error("Error updating portfolio:", err);
    throw err;
  }
};

// Delete portfolio
export const deletePortfolio = async (id) => {
  try {
    const { data } = await axios.delete(`/portfolios/${id}`);
    return data;
  } catch (err) {
    console.error("Error deleting portfolio:", err);
    throw err;
  }
};

// Add project to portfolio
export const addProjectToPortfolio = async (portfolioId, projectData) => {
  try {
    const { data } = await axios.post(`/portfolios/${portfolioId}/projects`, projectData);
    return data;
  } catch (err) {
    console.error("Error adding project:", err);
    throw err;
  }
};

// Remove project from portfolio
export const removeProjectFromPortfolio = async (portfolioId, projectIndex) => {
  try {
    const { data } = await axios.delete(`/portfolios/${portfolioId}/projects/${projectIndex}`);
    return data;
  } catch (err) {
    console.error("Error removing project:", err);
    throw err;
  }
};

/* ========================
   Pricing Suggestion Tool
   ======================== */

// Get AI-suggested pricing for a job
export const getSuggestedPricing = async (category, jobTitle, scope, level) => {
  try {
    const { data } = await axios.post("/ai/suggest/pricing", {
      category,
      jobTitle,
      scope: scope || "medium",
      level: level || "intermediate"
    });
    return data;
  } catch (err) {
    console.error("Error getting pricing suggestion:", err);
    throw err;
  }
};
