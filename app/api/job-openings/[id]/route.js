import dbConnect from '@/lib/dbConnect';
import JobPosting from '@/models/jobPosting';

export async function GET(req, { params }) {
    try {
      await dbConnect();
      const job = await JobPosting.findById(params.id);
  
      if (!job || job.isDeleted) {
        return new Response(JSON.stringify({ message: 'Job opening not found' }), { status: 404 });
      }
  
      return new Response(JSON.stringify(job), { status: 200 });
    } catch (error) {
      console.error('Error retrieving job posting:', error);
      return new Response(JSON.stringify({ message: 'Failed to fetch job opening' }), { status: 500 });
    }
  }

  // Soft delete job opening (DELETE)
export async function DELETE(req, { params }) {
    try {
      await dbConnect();
      const deletedJob = await JobPosting.findByIdAndUpdate(params.id, { isDeleted: true, updatedAt: Date.now() }, { new: true });
  
      if (!deletedJob) {
        return new Response(JSON.stringify({ message: 'Job opening not found' }), { status: 404 });
      }
  
      return new Response(JSON.stringify({ message: 'Job opening deleted successfully' }), { status: 200 });
    } catch (error) {
      console.error('Error deleting job posting:', error);
      return new Response(JSON.stringify({ message: 'Failed to delete job opening' }), { status: 500 });
    }
  }


  export async function PUT(req, { params }) {
    try {
      await dbConnect();
      const data = await req.json();
      const updatedJob = await JobPosting.findByIdAndUpdate(params.id, { ...data, updatedAt: Date.now() }, { new: true });
  
      if (!updatedJob) {
        return new Response(JSON.stringify({ message: 'Job opening not found' }), { status: 404 });
      }
  
      return new Response(JSON.stringify(updatedJob), { status: 200 });
    } catch (error) {
      console.error('Error updating job posting:', error);
      return new Response(JSON.stringify({ message: 'Failed to update job opening' }), { status: 500 });
    }
  }
