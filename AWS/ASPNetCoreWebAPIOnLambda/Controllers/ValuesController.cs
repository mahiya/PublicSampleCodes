﻿using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;

namespace AspNetWebApiOnLambda
{
    [Route("[controller]")]
    public class ValuesController : Controller
    {
        [HttpGet]
        public IEnumerable<string> Get()
        {
            return new string[] { "value1", "value2", "values3" };
        }
    }
}
