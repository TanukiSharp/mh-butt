using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace mh_butt_server
{
    public class ConsoleExLoggerProvider : ILoggerProvider
    {
        private readonly LogLevel logLevel;

        public ConsoleExLoggerProvider(IConfiguration config)
        {
            logLevel = config.GetValue<LogLevel>("Logging:ConsoleEx:LogLevel:Default");
            Console.WriteLine(logLevel);
        }

        private class ConsoleExLogger : ILogger
        {
            private static readonly object syncRoot = new object();
            private readonly string categoryName;
            private readonly LogLevel logLevel;

            public ConsoleExLogger(string categoryName, LogLevel logLevel)
            {
                this.categoryName = categoryName;
                this.logLevel = logLevel;
            }

            public IDisposable BeginScope<TState>(TState state)
            {
                return null;
            }

            public bool IsEnabled(LogLevel logLevel)
            {
                return (int)logLevel >= (int)this.logLevel;
            }

            public void Log<TState>(LogLevel logLevel, EventId eventId, TState state, Exception exception, Func<TState, Exception, string> formatter)
            {
                if (IsEnabled(logLevel) == false)
                    return;

                lock (syncRoot)
                {
                    Console.WriteLine($"{DateTime.Now.ToString("HH:mm:ss.fff")} | {logLevel} | {categoryName} | {formatter(state, exception)}");
                    Console.Out.Flush();
                }
            }
        }

        public ILogger CreateLogger(string categoryName)
        {
            return new ConsoleExLogger(categoryName, logLevel);
        }

        public void Dispose()
        {
        }
    }
}
