import { QBusinessClient, ChatCommand } from '@aws-sdk/client-qbusiness';

const qbusinessClient = new QBusinessClient({
  region: process.env.REACT_APP_AWS_REGION || 'ap-southeast-1',
});

export const searchDocuments = async (query) => {
  try {
    const command = new ChatCommand({
      applicationId: process.env.REACT_APP_QBUSINESS_APP_ID,
      userMessage: query,
      conversationId: undefined, // New conversation for each search
    });

    const response = await qbusinessClient.send(command);
    
    // Process Q Business response to extract search results
    return processQBusinessResponse(response, query);
  } catch (error) {
    console.error('Q Business search error:', error);
    
    // Return mock data for development/testing
    if (process.env.NODE_ENV === 'development') {
      return getMockSearchResults(query);
    }
    
    throw new Error('Search service temporarily unavailable. Please try again.');
  }
};

const processQBusinessResponse = (response, query) => {
  const results = [];
  
  // Process source attributions from Q Business response
  if (response.sourceAttributions && response.sourceAttributions.length > 0) {
    response.sourceAttributions.forEach((attribution, index) => {
      // Extract relevant information from attribution
      const result = {
        title: attribution.title || extractTitleFromUrl(attribution.url) || `Document ${index + 1}`,
        excerpt: attribution.snippet || generateExcerpt(attribution, query),
        source: attribution.url || '',
        citations: attribution.citationNumber ? [`Citation ${attribution.citationNumber}`] : [],
        relevanceScore: calculateRelevanceScore(attribution, query),
        fileSize: attribution.textMessageSegments?.[0]?.endOffset || null,
        lastModified: attribution.updatedAt || null
      };
      
      // Only include results with valid sources
      if (result.source) {
        results.push(result);
      }
    });
  }
  
  // If no source attributions, create results from the response text
  if (results.length === 0 && response.systemMessage) {
    results.push({
      title: 'AI Response',
      excerpt: response.systemMessage,
      source: '',
      citations: ['AI Generated Response'],
      relevanceScore: 0.8
    });
  }
  
  return results.sort((a, b) => (b.relevanceScore || 0) - (a.relevanceScore || 0));
};

const extractTitleFromUrl = (url) => {
  if (!url) return null;
  
  // Extract filename from S3 URL or path
  const parts = url.split('/');
  const filename = parts[parts.length - 1];
  
  // Remove file extension and format as title
  return filename
    .replace(/\.[^/.]+$/, '') // Remove extension
    .replace(/[-_]/g, ' ')    // Replace dashes and underscores with spaces
    .replace(/\b\w/g, l => l.toUpperCase()); // Capitalize first letter of each word
};

const generateExcerpt = (attribution, query) => {
  // Generate a relevant excerpt based on the attribution and query
  if (attribution.snippet) {
    return attribution.snippet;
  }
  
  if (attribution.textMessageSegments && attribution.textMessageSegments.length > 0) {
    return attribution.textMessageSegments[0].text || '';
  }
  
  return `Document contains information related to "${query}"`;
};

const calculateRelevanceScore = (attribution, query) => {
  // Simple relevance scoring based on available data
  let score = 0.5; // Base score
  
  // Boost score if title contains query terms
  if (attribution.title) {
    const titleWords = attribution.title.toLowerCase().split(/\s+/);
    const queryWords = query.toLowerCase().split(/\s+/);
    const matches = queryWords.filter(word => 
      titleWords.some(titleWord => titleWord.includes(word))
    );
    score += (matches.length / queryWords.length) * 0.3;
  }
  
  // Boost score if snippet contains query terms
  if (attribution.snippet) {
    const snippetLower = attribution.snippet.toLowerCase();
    const queryWords = query.toLowerCase().split(/\s+/);
    const matches = queryWords.filter(word => snippetLower.includes(word));
    score += (matches.length / queryWords.length) * 0.2;
  }
  
  return Math.min(score, 1.0);
};

// Mock data for development and testing
const getMockSearchResults = (query) => {
  const mockResults = [
    {
      title: 'Budget Allocation Report 2024',
      excerpt: `This document contains detailed budget allocation information for fiscal year 2024, including infrastructure projects and departmental funding.`,
      source: 's3://treasury-documents/region-1/budget-allocation-2024.pdf',
      citations: ['Budget Report 2024'],
      relevanceScore: 0.95,
      fileSize: 2048576,
      lastModified: '2024-01-15T10:30:00Z'
    },
    {
      title: 'Infrastructure Development Plan',
      excerpt: `Comprehensive plan for infrastructure development across all regions, including timelines, budgets, and implementation strategies.`,
      source: 's3://treasury-documents/region-1/infrastructure-plan.pdf',
      citations: ['Infrastructure Plan Document'],
      relevanceScore: 0.87,
      fileSize: 5242880,
      lastModified: '2024-02-01T14:20:00Z'
    },
    {
      title: 'Financial Audit Report Q1 2024',
      excerpt: `Quarterly financial audit report showing compliance status and recommendations for improvement in financial processes.`,
      source: 's3://treasury-documents/region-1/audit-report-q1-2024.pdf',
      citations: ['Q1 Audit Report'],
      relevanceScore: 0.76,
      fileSize: 1536000,
      lastModified: '2024-03-10T09:15:00Z'
    }
  ];
  
  // Filter mock results based on query
  const queryLower = query.toLowerCase();
  return mockResults.filter(result => 
    result.title.toLowerCase().includes(queryLower) ||
    result.excerpt.toLowerCase().includes(queryLower)
  );
};
