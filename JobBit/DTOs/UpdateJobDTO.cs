﻿using JobBit_Business;

namespace JobBit.DTOs
{
    public class UpdateJobDTO
    {
        public int JobID { get; set; }

        public int CompanyID { get; set; }
        public string Title { get; set; }
        public Job.enJopType JobType { get; set; }
        public Job.enJobExperience Experience { get; set; }
        public string? Description { get; set; }
        public int[] Skils { get; set; }
    }
}
