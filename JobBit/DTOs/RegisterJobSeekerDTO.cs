using JobBit_Business;

namespace JobBit.DTOs
{
    public class RegisterJobSeekerDTO
    {

        public string Email { get; set; }
        public string Password { get; set; }
        public string Phone { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }

        public JobSeeker.enGender Gender { get; set; }
        public IFormFile? CV { get; set; }

        public int[]? Skils { get; set; }

    }
}
