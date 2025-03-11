
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Microsoft.IdentityModel.Tokens;
using JobBit_DataAccess;
using JobBit_Business;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using JobBit.Global;
using JobBit.DTOs;
using static JobBit_DataAccess.UserData;
using System.Data;
using System.Reflection.Emit;

namespace JobBit.Controllers
{
    [Route("api/Auth")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        public AuthController(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        [HttpPost("RegisterJobSeeker", Name = "RegisterJobSeeker")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status409Conflict)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public ActionResult RegisterJobSeeker([FromForm] RegisterJobSeekerDTO registerDTO)
        {
            if (registerDTO == null || string.IsNullOrWhiteSpace(registerDTO.Email) || !Validation.ValidateEmail(registerDTO.Email) ||
                string.IsNullOrWhiteSpace(registerDTO.Password) || !Validation.ValidatePassword(registerDTO.Password) ||
                string.IsNullOrWhiteSpace(registerDTO.FirstName) || string.IsNullOrWhiteSpace(registerDTO.LastName) ||
                ! Enum.IsDefined(typeof(JobSeeker.enGender), (int)registerDTO.Gender) ||
                 string.IsNullOrWhiteSpace(registerDTO.Phone) || !Validation.ValidatePhone(registerDTO.Phone))

                return BadRequest(new { message = "Invalide JobSeeker Data" });


            if (JobBit_Business.User.IsUserExistByPhone(registerDTO.Phone))
                return BadRequest(new { message = "Phone Already Exist ", registerDTO.Phone });

            if (JobBit_Business.User.IsUserExistByEmail(registerDTO.Email))
                return BadRequest(new { message = "Email Already Exist ", registerDTO.Email });

            string? CvPath = null;
            string errorMessage = "";

            if (registerDTO.CV != null)
            {
                if (!FileService.ValidateFile(registerDTO.CV, FileService.enFileType.CV, out errorMessage))
                    return BadRequest(new { meassage = errorMessage });

                CvPath = FileService.SaveFile(registerDTO.CV, PathService.CVsFolder);
            }



            string PasswordHashed = Cryptography.ComputeHash(registerDTO.Password);




            JobSeeker jobSeeker = new JobSeeker(
                new JobSeekerDTO(-1, -1, null, registerDTO.FirstName, registerDTO.LastName,
                null, (byte)registerDTO.Gender, null, CvPath, null, null), new UserDTO(-1, registerDTO.Email,
                PasswordHashed, registerDTO.Phone, true)
                );


            if (!jobSeeker.Save())
                return StatusCode(409, "Error Add jobSeeker ,! no row add");

            if(registerDTO.Skils!=null)
            {
                JobSeekerSkill jobSeekerSkill = null;
                foreach (int skillID in registerDTO.Skils)
                {
                    if (!Skill.IsSkillExist(skillID) || JobSeeker.IsJobSeekerHaveThisSkill(jobSeeker.JobSeekerID, skillID))
                        continue;

                    jobSeekerSkill = new JobSeekerSkill(new JobSeekerSkillDTO(-1, jobSeeker.JobSeekerID, skillID));
                    jobSeekerSkill.Save();
                }
            }
            

            string Token = GenerateJwtToken(jobSeeker.UserID,JobBit_Business.User.enUserType.JobSeeker);

            return CreatedAtRoute("GetJobSeekerByID", new { JobSeekerID = jobSeeker.JobSeekerID }, new
            {
                token = Token,
                jobSeekerInfo = jobSeeker.alljobseekerInfo
            });

           
        }

        [HttpPost("RegisterCompany", Name = "RegisterCompany")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status409Conflict)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public ActionResult RegisterCompany( RegisterCompanyDTO registerDTO)
        {
            if (registerDTO == null || string.IsNullOrWhiteSpace(registerDTO.Email) || !Validation.ValidateEmail(registerDTO.Email) ||
                string.IsNullOrWhiteSpace(registerDTO.Password) || !Validation.ValidatePassword(registerDTO.Password) ||
                string.IsNullOrWhiteSpace(registerDTO.Link) || !Validation.ValidateLink(registerDTO.Link) ||
                string.IsNullOrWhiteSpace(registerDTO.Name) || registerDTO.WilayaID < 1 ||
                 string.IsNullOrWhiteSpace(registerDTO.Phone) || !Validation.ValidatePhone(registerDTO.Phone))

                return BadRequest(new { message = "Invalide Company Data" });



            if (JobBit_Business.User.IsUserExistByPhone(registerDTO.Phone))
                return BadRequest(new { message = "Phone Already Exist ", registerDTO.Phone });


            if (JobBit_Business.User.IsUserExistByEmail(registerDTO.Email))
                return BadRequest(new { message = "Email Already Exist ", registerDTO.Email });

            if (!Wilaya.IsWilayaExist(registerDTO.WilayaID))
                return BadRequest(new { message = "Wilaya Not Found ", registerDTO.WilayaID });






            string PasswordHashed = Cryptography.ComputeHash(registerDTO.Password);




            Company Company = new Company(
                new CompanyDTO(-1, -1, registerDTO.WilayaID, registerDTO.Name, null,
                null, registerDTO.Link), new JobBit_DataAccess.UserDTO (-1, registerDTO.Email,
                PasswordHashed, registerDTO.Phone, true)
                );


            if (!Company.Save())
                return StatusCode(409, "Error Add Company ,! no row add");

            string Token = GenerateJwtToken(Company.UserID, JobBit_Business.User.enUserType.Company);

            return CreatedAtRoute("GetCompanyByID", new { CompanyID = Company.CompanyID }, new
            {
                token = Token,
                companyInfo = Company.allCompanyInfo
            });

        }



        [HttpPost("LogInJobSeeker", Name = "LogInJobSeeker")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        public IActionResult LogInJobSeeker( LogInDTO loginDTO)
        {
            if (loginDTO == null || string.IsNullOrEmpty(loginDTO.Email) || string.IsNullOrEmpty(loginDTO.Password))
                return BadRequest("Invalide Data : ");

            string PasswordHased = Cryptography.ComputeHash(loginDTO.Password);

            JobSeeker jobSeeker = JobSeeker.FindByEmailAndPassword(loginDTO.Email, PasswordHased);

            if (jobSeeker == null)
                return Unauthorized("Invalid email or password.");


            if (!jobSeeker.IsActive)
                return StatusCode (403,new { message = "JobSeeker is inactive . Please contact support " });
            


            var Token = GenerateJwtToken(jobSeeker.UserID,JobBit_Business.User.enUserType.JobSeeker);

            return Ok(new
            {
                token = Token,
                jobSeekerInfo = jobSeeker.alljobseekerInfo
            });

        }


        [HttpPost("LogInCompany", Name = "LogInCompany")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        public IActionResult LogInCompany( LogInDTO loginDTO)
        {
            if (loginDTO == null || string.IsNullOrEmpty(loginDTO.Email) || string.IsNullOrEmpty(loginDTO.Password))
                return BadRequest("Invalide Data : ");

            string PasswordHased = Cryptography.ComputeHash(loginDTO.Password);

            Company comapny = Company.FindByEmailAndPassword(loginDTO.Email, PasswordHased);

            if (comapny == null)
                return Unauthorized("Invalid email or password.");


            if (!comapny.IsActive)
                return StatusCode(403, new { message = "Company is inactive . Please contact support " });



            var Token = GenerateJwtToken(comapny.UserID, JobBit_Business.User.enUserType.Company);

            return Ok(new
            {
                token = Token,
                comapnyInfo = comapny.allCompanyInfo
            });

        }


        [HttpPost("LogInUser", Name = "LogInUser")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        public IActionResult LogInUser(LogInDTO loginDTO)
        {
            if (loginDTO == null || string.IsNullOrEmpty(loginDTO.Email) || string.IsNullOrEmpty(loginDTO.Password))
                return BadRequest("Invalide Data : ");

            string PasswordHased = Cryptography.ComputeHash(loginDTO.Password);

            JobBit_Business.User user = JobBit_Business.User.FindBaseUser(loginDTO.Email, loginDTO.Password);

            if (user == null || JobSeeker.IsJobSeekerExistByUserID(user.UserID) || Company.IsCompanyExistByUserID(user.UserID))
                return Unauthorized("Invalid email or password.");


            if (!user.IsActive)
                return StatusCode(403, new { message = "admin is inactive " });


            
           

            return Ok(new
            {
                userInfo = user.userDTO
            });

        }



        [HttpPost("EmailVerification", Name = "EmailVerification")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        public IActionResult EmailVerification(EmailDTO emailDTO)
        {
            if (emailDTO == null || string.IsNullOrEmpty(emailDTO.Email) ||! Validation.ValidateEmail(emailDTO.Email))
                return BadRequest("Invalide Data : ");


            string OTPCode = Util.GenerateOTP();

            Contact.SendEmail(emailDTO.Email, "our OTP Code for Verification",
                $"Hello,\r\n\r\nWe received a request to verify your identity for our programming job platform.\r\n\r\nYour One-Time Password (OTP) is:\r\n\r\n********************\r\n       {OTPCode}\r\n********************\r\n\r\nPlease enter this code to complete the verification process.\r\n\r\nIf you didn’t request this, please ignore this email or contact our support team.\r\n\r\nBest regards,");


          
            
            return Ok(new {Code = OTPCode});
        }



        //[HttpPost("Logout", Name = "Logout")]
        //[ProducesResponseType(StatusCodes.Status200OK)]
        //[ProducesResponseType(StatusCodes.Status409Conflict)]
        //[ProducesResponseType(StatusCodes.Status401Unauthorized)]
        ////[Authorize]
        //public IActionResult Logout()
        //{
        //    var token = HttpContext.Request.Headers["Authorization"].ToString().Replace("Bearer ", "");

        //    if (string.IsNullOrEmpty(token))
        //    {
        //        return Unauthorized();
        //    }

        //    var handler = new JwtSecurityTokenHandler();
        //    var jwtToken = handler.ReadJwtToken(token);


        //    var expiryClaim = jwtToken.Claims.FirstOrDefault(c => c.Type == JwtRegisteredClaimNames.Exp);
        //    if (expiryClaim == null)
        //    {
        //        return StatusCode(StatusCodes.Status409Conflict, "Invalid token");
        //    }

        //    var expiryDateUnix = long.Parse(expiryClaim.Value);
        //    var expiryDate = DateTimeOffset.FromUnixTimeSeconds(expiryDateUnix).UtcDateTime;


        //    BlackList blackList = new BlackList(new BlackListDTO(-1, token, expiryDate));
        //    if (!blackList.Save())
        //        return StatusCode(StatusCodes.Status409Conflict, "Error To Logout");

        //    return Ok(new { message = "Logged out successfully" });
        //}


        //[HttpPost("Refresh", Name = "Refresh")]
        //[ProducesResponseType(StatusCodes.Status200OK)]
        //[ProducesResponseType(StatusCodes.Status401Unauthorized)]
        //[ProducesResponseType(StatusCodes.Status409Conflict)]
        ////[Authorize]
        //public IActionResult Refresh()
        //{
        //    var token = HttpContext.Request.Headers["Authorization"].ToString().Replace("Bearer ", "");

        //    if (string.IsNullOrEmpty(token))
        //    {
        //        return Unauthorized("Token is missing.");
        //    }

        //    var handler = new JwtSecurityTokenHandler();
        //    var jwtToken = handler.ReadJwtToken(token);

        //    var expiryClaim = jwtToken.Claims.FirstOrDefault(c => c.Type == JwtRegisteredClaimNames.Exp);
        //    if (expiryClaim == null)
        //    {
        //        return Unauthorized("Invalid token.");
        //    }

        //    var expiryDateUnix = long.Parse(expiryClaim.Value);
        //    var expiryDate = DateTimeOffset.FromUnixTimeSeconds(expiryDateUnix).UtcDateTime;

        //    if (expiryDate < DateTime.UtcNow)
        //        return Unauthorized("Token has expired.");

        //    BlackList blackList = new BlackList(new BlackListDTO(-1, token, expiryDate));
        //    if (!blackList.Save())
        //        return StatusCode(StatusCodes.Status409Conflict, "Error saving to blacklist.");

        //    var userId = int.Parse(jwtToken.Claims.First(c => c.Type == JwtRegisteredClaimNames.Sub).Value);
        //    var newToken = GenerateJwtToken(userId);

        //    clsUser user = clsUser.Find(userId);

        //    return Ok(new
        //    {
        //        token = newToken,
        //        userInfo = user,
        //    });

        //}



        private string GenerateJwtToken(int UserId,User.enUserType userType)
        {
            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:SecretKey"]));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                   new Claim(JwtRegisteredClaimNames.Sub, UserId.ToString()), // Sub: الموضوع (المستخدم أو الهوية)
                   new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()), // معرف التوكن الفريد
                   new Claim(ClaimTypes.Role, userType.ToString()) // 🔹 تحديد نوع المستخدم
            };

            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"], // الجهة المُصدِرة للتوكن
                audience: _configuration["Jwt:Audience"], // الجمهور المستهدف للتوكن
                claims: claims,
                expires: DateTime.Now.AddMinutes(Convert.ToDouble(_configuration["Jwt:ExpireMinutes"])), // انتهاء الصلاحية
                signingCredentials: credentials);

            return new JwtSecurityTokenHandler().WriteToken(token); // تحويل التوكن إلى نص
        }



    }

    

   

   
}
