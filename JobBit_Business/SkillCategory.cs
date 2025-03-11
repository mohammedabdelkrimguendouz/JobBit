using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using JobBit_DataAccess;

namespace JobBit_Business
{
    public class SkillCategory
    {
        public enum enMode { AddNew = 0, Update = 1 };
        private enMode Mode = enMode.AddNew;
        public SkillCategoryDTO skillcategoryDTO
        {
            get => new SkillCategoryDTO(this.SkillCategoryID, this.Name);
        }
        public int SkillCategoryID { get; set; }
        public string Name { get; set; }

        public SkillCategory(SkillCategoryDTO skillcategoryDTO, enMode CreationMode = enMode.AddNew)
        {
            this.SkillCategoryID = skillcategoryDTO.SkillCategoryID;
            this.Name = skillcategoryDTO.Name
            ;
            Mode = CreationMode;
        }

        public static SkillCategory Find(int SkillCategoryID)
        {

            SkillCategoryDTO skillcategoryDTO = SkillCategoryData.GetSkillCategoryInfoByID(SkillCategoryID);

            if (skillcategoryDTO != null)
            {
                return new SkillCategory(skillcategoryDTO, enMode.Update);
            }
            return null;

        }

        public static SkillCategory Find(string Name)
        {

            SkillCategoryDTO skillcategoryDTO = SkillCategoryData.GetSkillCategoryInfoByName(Name);

            if (skillcategoryDTO != null)
            {
                return new SkillCategory(skillcategoryDTO, enMode.Update);
            }
            return null;

        }

        private bool _AddNewSkillCategory()
        {
            this.SkillCategoryID = SkillCategoryData.AddNewSkillCategory(this.skillcategoryDTO);
            return (this.SkillCategoryID != -1);
        }

        private bool _UpdateSkillCategory()
        {
            return SkillCategoryData.UpdateSkillCategory(this.skillcategoryDTO);
        }

        public bool Save()
        {
            switch (Mode)
            {
                case enMode.AddNew:
                    if (_AddNewSkillCategory())
                    {
                        Mode = enMode.Update;
                        return true;
                    }
                    else
                        return false;
                case enMode.Update:
                    return _UpdateSkillCategory();
            }
            return false;
        }

        public static bool DeleteSkillCategory(int SkillCategoryID)
        {
            return SkillCategoryData.DeleteSkillCategory(SkillCategoryID);
        }

        public static List<SkillCategoryDTO> GetAllSkillCategories()
        {
            return SkillCategoryData.GetAllSkillCategories();
        }

        public static bool IsSkillCategoryExist(int SkillCategoryID)
        {
            return SkillCategoryData.IsSkillCategoryExistByID(SkillCategoryID);
        }

        public static bool IsSkillCategoryExist(string Name)
        {
            return SkillCategoryData.IsSkillCategoryExistByName(Name);
        }


    }
}
