namespace JobBit.DTOs
{
    public class FilterJobsDTO
    {
       public int[]? WilayaIDs { get; set; }
       public int[]? SkillIDs { get; set; }
       public int[]? JobTypeIDs { get; set; }
       public int[]? JobExperienceIDs { get; set; }
    }
}
