using System;
using System.Collections.Generic;
using System.Data;
using System.Diagnostics;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Data.SqlClient;

namespace JobBit_DataAccess
{
    public class SkillCategoryDTO
    {
        public int SkillCategoryID { get; set; }
        public string Name { get; set; }

        public SkillCategoryDTO(int SkillCategoryID, string Name)
        {
            this.SkillCategoryID = SkillCategoryID;
            this.Name = Name;
        }

    }
    public class SkillCategoryData
    {
        public static int AddNewSkillCategory(SkillCategoryDTO skillcategoryDTO)
        {
            int SkillCategoryID = -1;
            try
            {
                using (SqlConnection Connection = new SqlConnection(clsDataAccessSettings.ConnectionString))
                {
                    Connection.Open();
                    using (SqlCommand Command = new SqlCommand("SP_AddNewSkillCategory", Connection))
                    {
                        Command.CommandType = CommandType.StoredProcedure;
                        Command.Parameters.AddWithValue("@Name", skillcategoryDTO.Name);


                        SqlParameter outputIdParam = new SqlParameter("@SkillCategoryID", SqlDbType.Int)
                        {
                            Direction = ParameterDirection.Output
                        };
                        Command.Parameters.Add(outputIdParam);


                        Command.ExecuteNonQuery();

                        SkillCategoryID = (int)outputIdParam.Value;

                    }
                }

            }
            catch (Exception Ex)
            {
                clsEventLogData.WriteEvent($" Message : {Ex.Message} \n\n Source : {Ex.Source} \n\n Target Site :  {Ex.TargetSite} \n\n Stack Trace :  {Ex.StackTrace}", EventLogEntryType.Error);
                SkillCategoryID = -1;
            }
            return SkillCategoryID;
        }

        public static bool UpdateSkillCategory(SkillCategoryDTO skillcategoryDTO)
        {
            int RowsEffected = 0;
            try
            {
                using (SqlConnection Connection = new SqlConnection(clsDataAccessSettings.ConnectionString))
                {
                    Connection.Open();
                    using (SqlCommand Command = new SqlCommand("SP_UpdateSkillCategory", Connection))
                    {
                        Command.CommandType = CommandType.StoredProcedure;
                        Command.Parameters.AddWithValue("@SkillCategoryID", skillcategoryDTO.SkillCategoryID);
                        Command.Parameters.AddWithValue("@Name", skillcategoryDTO.Name);


                        SqlParameter RowsEffectedParam = new SqlParameter("@RowsEffected", SqlDbType.Int)
                        {
                            Direction = ParameterDirection.ReturnValue
                        };
                        Command.Parameters.Add(RowsEffectedParam);

                        Command.ExecuteNonQuery();
                        RowsEffected = ((int)RowsEffectedParam.Value);


                    }
                }
            }
            catch (Exception Ex)
            {
                clsEventLogData.WriteEvent($" Message : {Ex.Message} \n\n Source : {Ex.Source} \n\n Target Site :  {Ex.TargetSite} \n\n Stack Trace :  {Ex.StackTrace}", EventLogEntryType.Error);
                RowsEffected = 0;
            }

            return (RowsEffected == 1);
        }

        public static bool DeleteSkillCategory(int SkillCategoryID)
        {
            int RowsEffected = 0;
            try
            {
                using (SqlConnection Connection = new SqlConnection(clsDataAccessSettings.ConnectionString))
                {
                    Connection.Open();
                    using (SqlCommand Command = new SqlCommand("SP_DeleteSkillCategory", Connection))
                    {
                        Command.CommandType = CommandType.StoredProcedure;
                        Command.Parameters.AddWithValue("@SkillCategoryID", SkillCategoryID);


                        SqlParameter RowsEffectedParam = new SqlParameter("@RowsEffected", SqlDbType.Int)
                        {
                            Direction = ParameterDirection.ReturnValue
                        };
                        Command.Parameters.Add(RowsEffectedParam);

                        Command.ExecuteNonQuery();
                        RowsEffected = ((int)RowsEffectedParam.Value);

                    }
                }
            }
            catch (Exception Ex)
            {
                clsEventLogData.WriteEvent($" Message : {Ex.Message} \n\n Source : {Ex.Source} \n\n Target Site :  {Ex.TargetSite} \n\n Stack Trace :  {Ex.StackTrace}", EventLogEntryType.Error);
                RowsEffected = 0;
            }

            return RowsEffected == 1;
        }

        public static List<SkillCategoryDTO> GetAllSkillCategories()
        {
            List<SkillCategoryDTO> ListSkillCategories = new List<SkillCategoryDTO>();
            try
            {
                using (SqlConnection Connection = new SqlConnection(clsDataAccessSettings.ConnectionString))
                {
                    Connection.Open();
                    using (SqlCommand Command = new SqlCommand("SP_GetAllSkillCategories", Connection))
                    {
                        Command.CommandType = CommandType.StoredProcedure;
                        using (SqlDataReader Reader = Command.ExecuteReader())
                        {
                            while (Reader.Read())
                            {
                                ListSkillCategories.Add
                                   (
                                      new SkillCategoryDTO
                                      (
                                         Reader.GetInt32(Reader.GetOrdinal("SkillCategoryID")),
Reader.GetString(Reader.GetOrdinal("Name"))
                                      )
                                   );
                            }
                        }


                    }
                }
            }
            catch (Exception Ex)
            {
                clsEventLogData.WriteEvent($" Message : {Ex.Message} \n\n Source : {Ex.Source} \n\n Target Site :  {Ex.TargetSite} \n\n Stack Trace :  {Ex.StackTrace}", EventLogEntryType.Error);

            }

            return ListSkillCategories;
        }

        public static bool IsSkillCategoryExistByID(int SkillCategoryID)
        {
            bool IsFound = false;
            try
            {
                using (SqlConnection Connection = new SqlConnection(clsDataAccessSettings.ConnectionString))
                {
                    Connection.Open();
                    using (SqlCommand Command = new SqlCommand("SP_IsSkillCategoryExistByID", Connection))
                    {
                        Command.CommandType = CommandType.StoredProcedure;
                        Command.Parameters.AddWithValue("@SkillCategoryID", SkillCategoryID);
                        SqlParameter IsFoundParam = new SqlParameter("@IsFound", SqlDbType.Int)
                        {
                            Direction = ParameterDirection.ReturnValue
                        };
                        Command.Parameters.Add(IsFoundParam);

                        Command.ExecuteNonQuery();
                        IsFound = ((int)IsFoundParam.Value == 1);

                    }
                }
            }
            catch (Exception Ex)
            {
                clsEventLogData.WriteEvent($" Message : {Ex.Message} \n\n Source : {Ex.Source} \n\n Target Site :  {Ex.TargetSite} \n\n Stack Trace :  {Ex.StackTrace}", EventLogEntryType.Error);
                IsFound = false;
            }
            return IsFound;
        }

        public static bool IsSkillCategoryExistByName(string Name)
        {
            bool IsFound = false;
            try
            {
                using (SqlConnection Connection = new SqlConnection(clsDataAccessSettings.ConnectionString))
                {
                    Connection.Open();
                    using (SqlCommand Command = new SqlCommand("SP_IsSkillCategoryExistByName", Connection))
                    {
                        Command.CommandType = CommandType.StoredProcedure;
                        Command.Parameters.AddWithValue("@Name", Name);
                        SqlParameter IsFoundParam = new SqlParameter("@IsFound", SqlDbType.Int)
                        {
                            Direction = ParameterDirection.ReturnValue
                        };
                        Command.Parameters.Add(IsFoundParam);

                        Command.ExecuteNonQuery();
                        IsFound = ((int)IsFoundParam.Value == 1);

                    }
                }
            }
            catch (Exception Ex)
            {
                clsEventLogData.WriteEvent($" Message : {Ex.Message} \n\n Source : {Ex.Source} \n\n Target Site :  {Ex.TargetSite} \n\n Stack Trace :  {Ex.StackTrace}", EventLogEntryType.Error);
                IsFound = false;
            }
            return IsFound;
        }

        public static SkillCategoryDTO GetSkillCategoryInfoByID(int SkillCategoryID)
        {
            SkillCategoryDTO skillcategoryDTO = null;
            try
            {
                using (SqlConnection Connection = new SqlConnection(clsDataAccessSettings.ConnectionString))
                {
                    Connection.Open();
                    using (SqlCommand Command = new SqlCommand("SP_GetSkillCategoryInfoByID", Connection))
                    {
                        Command.CommandType = CommandType.StoredProcedure;
                        Command.Parameters.AddWithValue("@SkillCategoryID", SkillCategoryID);
                        using (SqlDataReader Reader = Command.ExecuteReader())
                        {
                            if (Reader.Read())
                            {

                                skillcategoryDTO = new SkillCategoryDTO(Reader.GetInt32(Reader.GetOrdinal("SkillCategoryID")),
Reader.GetString(Reader.GetOrdinal("Name"))
                                 );

                            }
                            else
                                skillcategoryDTO = null;
                        }
                    }
                }
            }
            catch (Exception Ex)
            {
                clsEventLogData.WriteEvent($" Message : {Ex.Message} \n\n Source : {Ex.Source} \n\n Target Site :  {Ex.TargetSite} \n\n Stack Trace :  {Ex.StackTrace}", EventLogEntryType.Error);
                skillcategoryDTO = null;
            }
            return skillcategoryDTO;

        }

        public static SkillCategoryDTO GetSkillCategoryInfoByName(string Name)
        {
            SkillCategoryDTO skillcategoryDTO = null;
            try
            {
                using (SqlConnection Connection = new SqlConnection(clsDataAccessSettings.ConnectionString))
                {
                    Connection.Open();
                    using (SqlCommand Command = new SqlCommand("SP_GetSkillCategoryInfoByName", Connection))
                    {
                        Command.CommandType = CommandType.StoredProcedure;
                        Command.Parameters.AddWithValue("@Name", Name);
                        using (SqlDataReader Reader = Command.ExecuteReader())
                        {
                            if (Reader.Read())
                            {

                                skillcategoryDTO = new SkillCategoryDTO(Reader.GetInt32(Reader.GetOrdinal("SkillCategoryID")),
Reader.GetString(Reader.GetOrdinal("Name"))
                                 );

                            }
                            else
                                skillcategoryDTO = null;
                        }
                    }
                }
            }
            catch (Exception Ex)
            {
                clsEventLogData.WriteEvent($" Message : {Ex.Message} \n\n Source : {Ex.Source} \n\n Target Site :  {Ex.TargetSite} \n\n Stack Trace :  {Ex.StackTrace}", EventLogEntryType.Error);
                skillcategoryDTO = null;
            }
            return skillcategoryDTO;

        }



    }
}
