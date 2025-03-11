using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using JobBit_DataAccess;
using static JobBit_DataAccess.JobSkillData;

namespace JobBit_Business
{
    public class Job
    {
        public enum enMode { AddNew = 0, Update = 1 };
        public enum enJopType {Remote, OnSite,  Hybrid };
        public enum enJobExperience { Beginner, Junior, Senior, Expert }
        private enMode Mode = enMode.AddNew;
        public JobDTO jobDTO
        {
            get => new JobDTO(this.JobID, this.CompanyID, (byte)this.JobType, this.PostedDate, (byte)this.Experience, this.Available, this.Description,this.Title);
        }

        public object allJobInfoDTO
        {
            get => new
            {
                JobID,
                ComapnyInfo = ComapnyInfo.allCompanyInfo,
                JobType,
                PostedDate,
                Experience,
                Available,
                Title,
                Description,
                Skills = GetAllSkillsForJob()
            };
        }

        public int JobID { get; set; }
        public int CompanyID { get; set; }
        public Company ComapnyInfo { get; set; }
        public enJopType JobType { get; set; }
        public DateTime PostedDate { get; set; }
        public string Title { get; set; }
        public enJobExperience Experience { get; set; }
        public bool Available { get; set; }
        public string? Description { get; set; }


    

        public Job(JobDTO jobDTO, enMode CreationMode = enMode.AddNew)
        {
            this.JobID = jobDTO.JobID;
            this.CompanyID = jobDTO.CompanyID;
            this.ComapnyInfo = Company.FindByCompanyID(this.CompanyID);
            this.JobType = (enJopType)jobDTO.JobType;
            this.PostedDate = jobDTO.PostedDate;
            this.Experience = (enJobExperience)jobDTO.Experience;
            this.Available = jobDTO.Available;
            this.Description = jobDTO.Description
            ;
            this.Title = jobDTO.Title;
            Mode = CreationMode;
        }

        public static Job Find(int JobID)
        {
            JobDTO jobDTO = JobData.GetJobInfoByID(JobID);

            if (jobDTO != null)
            {
                return new Job(jobDTO, enMode.Update);
            }
            return null;

        }

        private bool _AddNewJob()
        {
            this.JobID = JobData.AddNewJob(this.jobDTO);
            return (this.JobID != -1);
        }

        private bool _UpdateJob()
        {
            return JobData.UpdateJob(this.jobDTO);
        }

        public bool Save()
        {
            switch (Mode)
            {
                case enMode.AddNew:
                    if (_AddNewJob())
                    {
                        Mode = enMode.Update;
                        return true;
                    }
                    else
                        return false;
                case enMode.Update:
                    return _UpdateJob();
            }
            return false;
        }

        public static bool DeleteJob(int JobID)
        {
            return JobData.DeleteJob(JobID);
        }

        public static List<JobListByCategoryDTO> GetAllJobs()
        {
            return JobData.GetAllJobs();
        }
        public static List<JobDTO> GetAllJobsForCompany(int CompanyID)
        {
            return JobData.GetAllJobsForCompany(CompanyID);
        }

        //public static List<JobListDTO> GetJobsBySkillSet(int[] SkillSet, int PageNumber)
        //{
        //    return JobData.GetJobsBySkillSet(SkillSet, PageNumber);
        //}


        public static List<JobListDTO> FilterJobs(int[]? WilayaIDs, int[]? SkillIDs,
            int[]? JobTypeIDs, int[]? JobExperienceIDs)
        {
            return JobData.FilterJobs(WilayaIDs,SkillIDs,JobTypeIDs,JobExperienceIDs);
        }



        public static List<JobListDTO> GetJobsByCategory(int CategoryID)
        {
            return JobData.GetJobsByCategory(CategoryID);
        }

        public static bool IsJobExist(int JobID)
        {
            return JobData.IsJobExistByID(JobID);
        }

        public static bool IsCompanyPostedJob( int CompanyID, int JobID)
        {
            return JobData.IsCompanyPostedJob(CompanyID,JobID);
        }

        public static bool DeleteAllSkillsForJob(int JobID)
        {
            return JobSkill.DeleteAllSkillsForJob(JobID);
        }
        public  bool DeleteAllSkills()
        {
            return JobSkill.DeleteAllSkillsForJob(JobID);
        }


        public static List<SkillDTO> GetAllSkillsForJob(int JobID)
        {
            return JobSkill.GetAllSkillsForJob(JobID);
        }
        public  List<SkillDTO> GetAllSkillsForJob()
        {
            return JobSkill.GetAllSkillsForJob(JobID);
        }



        public static bool IsJobHaveThisSkill(int JobID, int SkillID)
        {
            return JobSkill.IsJobHaveThisSkill(JobID, SkillID);
        }
        public  bool IsJobHaveThisSkill(int SkillID)
        {
            return JobSkill.IsJobHaveThisSkill(JobID, SkillID);
        }


         
    }
}
