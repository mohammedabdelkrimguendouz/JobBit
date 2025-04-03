using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using JobBit_DataAccess;

namespace JobBit_Business
{
    public class Skill
    {
        public class AllSkillInfo
        {
            public int SkillID { get; set; }
            public string Name { get; set; }
            public string? IconUrl { get; set; }
            public SkillCategoryDTO SkillCategoryInfo { get; set; }

           
            public AllSkillInfo(int skillID, string name, string? iconUrl, SkillCategoryDTO skillCategoryInfo)
            {
                SkillID = skillID;
                Name = name;
                IconUrl = iconUrl;
                SkillCategoryInfo = skillCategoryInfo;
            }
        }

        public enum enMode { AddNew = 0, Update = 1 };
        private enMode Mode = enMode.AddNew;
        public SkillDTO skillDTO
        {
            get => new SkillDTO(this.SkillID, this.SkillCategoryID, this.Name,this.IconUrl);
        }
        public AllSkillInfo allSkillInfo
        {
            get => new AllSkillInfo(
                SkillID,
                Name,
                IconUrl,
                SkillCategoryInfo.skillcategoryDTO
            );
        }


        public string? IconUrl { get; set; }
        public int SkillID { get; set; }
        public int SkillCategoryID { get; set; }
        public SkillCategory SkillCategoryInfo;
        public string Name { get; set; }

        public Skill(SkillDTO skillDTO, enMode CreationMode = enMode.AddNew)
        {
            this.SkillID = skillDTO.SkillID;
            this.SkillCategoryID = skillDTO.SkillCategoryID;
            this.SkillCategoryInfo = SkillCategory.Find(this.SkillCategoryID);
            this.Name = skillDTO.Name
            ;
            this.IconUrl = skillDTO.IconUrl;
            Mode = CreationMode;

        }

        public static Skill Find(int SkillID)
        {

            SkillDTO skillDTO = SkillData.GetSkillInfoByID(SkillID);

            if (skillDTO != null)
            {
                return new Skill(skillDTO, enMode.Update);
            }
            return null;

        }

        public static Skill Find(string Name)
        {

            SkillDTO skillDTO = SkillData.GetSkillInfoByName(Name);

            if (skillDTO != null)
            {
                return new Skill(skillDTO, enMode.Update);
            }
            return null;

        }

        private bool _AddNewSkill()
        {
            this.SkillID = SkillData.AddNewSkill(this.skillDTO);
            return (this.SkillID != -1);
        }

        private bool _UpdateSkill()
        {
            return SkillData.UpdateSkill(this.skillDTO);
        }

        public bool Save()
        {
            switch (Mode)
            {
                case enMode.AddNew:
                    if (_AddNewSkill())
                    {
                        Mode = enMode.Update;
                        return true;
                    }
                    else
                        return false;
                case enMode.Update:
                    {
                         return _UpdateSkill();
                    }
                   
            }
            return false;
        }

        public static bool DeleteSkill(int SkillID)
        {
            return SkillData.DeleteSkill(SkillID);
        }

        public static List<SkillsListDTO> GetAllSkills()
        {
            return SkillData.GetAllSkills();
        }
        public static List<SkillDTO> GetAllSkillsByCategoryID(int CategoryID)
        {
            return SkillData.GetAllSkillsByCategoryID(CategoryID);
        }

        public static bool IsSkillExist(int SkillID)
        {
            return SkillData.IsSkillExistByID(SkillID);
        }
        public static bool IsSkillExist(string Name)
        {
            return SkillData.IsSkillExistByName(Name);
        }


    }
}
