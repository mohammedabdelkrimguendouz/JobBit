using JobBit_Business;
using JobBit_DataAccess;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace JobBit.Controllers
{
    [Route("api/SkillCategories")]
    [ApiController]
    public class SkillCategoriesController : ControllerBase
    {
        [HttpGet("GetAllSkillCategories", Name = "GetAllSkillCategories")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public ActionResult<IEnumerable<SkillCategoryDTO>> GetAllSkillCategories()
        {
            List<SkillCategoryDTO> SkillCategorysList = SkillCategory.GetAllSkillCategories();

            if (SkillCategorysList.Count == 0)
                return NotFound(new { message = "No Skill Categories found" });

            return Ok(SkillCategorysList);
        }



        [HttpGet("GetSkillCategoryByID/{SkillCategoryID}", Name = "GetSkillCategoryByID")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public ActionResult<SkillCategoryDTO> GetSkillCategoryByID(int SkillCategoryID)
        {
            if (SkillCategoryID < 1)
                return BadRequest(new { message = "Invalid SkillCategory ID", SkillCategoryID });

            SkillCategory SkillCategory = SkillCategory.Find(SkillCategoryID);

            if (SkillCategory == null)
                return NotFound(new { message = "SkillCategory not found", SkillCategoryID });

            return Ok(SkillCategory.skillcategoryDTO);
        }



        [HttpGet("GetSkillCategoryByName/{SkillCategoryName}", Name = "GetSkillCategoryByName")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public ActionResult<SkillCategoryDTO> GetSkillCategoryByName(string SkillCategoryName)
        {
            if (string.IsNullOrWhiteSpace(SkillCategoryName))
                return BadRequest(new { message = "Invalid SkillCategory name" });

            SkillCategory SkillCategory = SkillCategory.Find(SkillCategoryName);

            if (SkillCategory == null)
                return NotFound(new { message = "SkillCategory not found", SkillCategoryName });

            return Ok(SkillCategory.skillcategoryDTO);
        }



        [HttpGet("IsSkillCategoryExistByID/{SkillCategoryID}", Name = "IsSkillCategoryExistByID")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public ActionResult IsSkillCategoryExistByID(int SkillCategoryID)
        {
            if (SkillCategoryID < 1)
                return BadRequest(new { message = "Invalid SkillCategory ID", SkillCategoryID });

            bool isSkillCategoryExist = SkillCategory.IsSkillCategoryExist(SkillCategoryID);

            if (!isSkillCategoryExist)
                return NotFound(new { message = "SkillCategory not found", SkillCategoryID });

            return Ok(new { message = "SkillCategory exists", SkillCategoryID });
        }

        [HttpGet("IsSkillCategoryExistByName/{SkillCategoryName}", Name = "IsSkillCategoryExistByName")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public ActionResult IsSkillCategoryExistByName(string SkillCategoryName)
        {
            if (string.IsNullOrWhiteSpace(SkillCategoryName))
                return BadRequest(new { message = "Invalid SkillCategory name" });

            bool isSkillCategoryExist = SkillCategory.IsSkillCategoryExist(SkillCategoryName);

            if (!isSkillCategoryExist)
                return NotFound(new { message = "SkillCategory not found", SkillCategoryName });

            return Ok(new { message = "SkillCategory exists", SkillCategoryName });
        }

        [HttpDelete("DeleteSkillCategory/{SkillCategoryID}", Name = "DeleteSkillCategory")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status409Conflict)]

        public ActionResult DeleteSkillCategory(int SkillCategoryID)
        {
            if (SkillCategoryID < 1)
                return BadRequest(new { message = "Invalide SkillCategory ID ", SkillCategoryID });

            if (!SkillCategory.IsSkillCategoryExist(SkillCategoryID))
                return NotFound(new { message = "SkillCategory not found ", SkillCategoryID });


            if (!SkillCategory.DeleteSkillCategory(SkillCategoryID))
                return StatusCode(409, new { message = "Error Delete SkillCategory , ! .no row deleted" });


            return Ok(new { message = "SkillCategory has been deleted", SkillCategoryID });

        }



        [HttpPost("AddSkillCategory", Name = "AddSkillCategory")]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status409Conflict)]

        public ActionResult<SkillCategoryDTO> AddSkillCategory(SkillCategoryDTO NewSkillCategoryDTO)
        {
            if (NewSkillCategoryDTO == null || string.IsNullOrWhiteSpace(NewSkillCategoryDTO.Name))
                return BadRequest(new { message = "Invalid SkillCategory Data !" });

            if (JobBit_Business.SkillCategory.IsSkillCategoryExist(NewSkillCategoryDTO.Name))
                return BadRequest(new { message = "SkillCategory Name Already Exist !" });





            SkillCategory SkillCategory = new SkillCategory(
                new SkillCategoryDTO(-1, NewSkillCategoryDTO.Name)
                );


            if (!SkillCategory.Save())
                return StatusCode(409, new { message = "Error Add SkillCategory ,! no row add" });

            return CreatedAtRoute("GetSkillCategoryByID", new { SkillCategoryID = SkillCategory.SkillCategoryID }, SkillCategory.skillcategoryDTO);

        }


        [HttpPut("UpdateSkillCategory", Name = "UpdateSkillCategory")]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status409Conflict)]

        public ActionResult<SkillCategoryDTO> UpdateSkillCategory(SkillCategoryDTO UpdateSkillCategoryDTO)
        {
            if (UpdateSkillCategoryDTO == null || UpdateSkillCategoryDTO.SkillCategoryID < 1 || string.IsNullOrWhiteSpace(UpdateSkillCategoryDTO.Name))
                return BadRequest(new { message = "Invalid SkillCategory Data !" });

            SkillCategory SkillCategory = SkillCategory.Find(UpdateSkillCategoryDTO.SkillCategoryID);

            if (SkillCategory == null)
                return NotFound(new { message = "SkillCategory not found ", UpdateSkillCategoryDTO.SkillCategoryID });

            if (UpdateSkillCategoryDTO.Name.ToLower() != SkillCategory.Name.ToLower() && JobBit_Business.SkillCategory.IsSkillCategoryExist(UpdateSkillCategoryDTO.Name))
                return BadRequest(new { message = "New SkillCategory Name Already Exist !" });



            SkillCategory.Name = UpdateSkillCategoryDTO.Name;

            if (!SkillCategory.Save())
                return StatusCode(409, new { message = "Error Update SkillCategory " });

            return Ok(new { message = "SkillCategory updated successfully", SkillCategory.skillcategoryDTO });

        }
    }
}
