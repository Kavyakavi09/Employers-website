import dbConnect from '@/lib/dbConnect';
import JobPosting from '@/models/jobPosting';

// Create a job opening (POST)
export async function POST(req) {
  try {
    await dbConnect();
    const data = await req.json();
    const jobPosting = new JobPosting(data);

    const savedJob = await jobPosting.save();
    return new Response(JSON.stringify(savedJob), { status: 201 });
  } catch (error) {
    console.error('Error creating job posting:', error);
    return new Response(JSON.stringify({ message: 'Failed to create job opening' }), { status: 500 });
  }
}

// Get all job openings (GET)
export async function GET(req) {
    try {
      await dbConnect();
      const { searchParams } = new URL(req.url);
      const filters = {};
      const page = parseInt(searchParams.get('page')) || 1;
      const perPage = parseInt(searchParams.get('perPage')) || 10;
      const skip = (page - 1) * perPage;
  
      // Apply filters from query params
      ['department', 'specialization', 'location', 'experienceLevel', 'isRemote'].forEach((key) => {
        if (searchParams.get(key)) {
          filters[key] = searchParams.get(key);
        }
      });
  
      const jobTitleSearch = searchParams.get('jobTitle');
      if (jobTitleSearch) {
        filters.jobTitle = new RegExp(jobTitleSearch, 'i'); // Case-insensitive regex search
      }
  
      // Find job postings with the filters applied
      const jobPostings = await JobPosting.find({ ...filters, isDeleted: false })
        .skip(skip)
        .limit(perPage)
        .sort({ createdAt: -1 });
  
      const totalCount = await JobPosting.countDocuments({ ...filters, isDeleted: false });
  
      return new Response(
        JSON.stringify({ jobPostings, totalCount }),
        { status: 200 }
      );
    } catch (error) {
      console.error('Error retrieving job postings:', error);
      return new Response(
        JSON.stringify({ message: 'Failed to fetch job openings' }),
        { status: 500 }
      );
    }
  }
