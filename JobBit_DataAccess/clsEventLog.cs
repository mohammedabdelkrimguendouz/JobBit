
using System;
using System.Diagnostics;
using Microsoft.Extensions.Logging.EventLog;

namespace JobBit_DataAccess
{
    public class clsEventLogData
    {
        public static void WriteEvent(string Message, EventLogEntryType eventLogEntryType)
        {

            string SourceName = "JobBit";

            try
            {
                if (!EventLog.SourceExists(SourceName))
                {
                    EventLog.CreateEventSource(SourceName, "Application");
                }

                EventLog.WriteEntry(SourceName, Message, eventLogEntryType);
            }
            catch (Exception Ex)
            {

            }

        }

    }
}
