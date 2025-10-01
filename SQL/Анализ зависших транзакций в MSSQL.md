**1 Запрос покажет все зависшие сессии и покажет какие именно сессии их блокируют** 

SELECT  
    r.session_id            AS blocked_session_id,  
    r.status                AS blocked_status,  
    r.wait_type,  
    r.wait_resource,  
    r.blocking_session_id   AS blocking_session_id,  
    t.text                  AS blocked_sql,  
    t2.text                 AS blocking_sql  
FROM sys.dm_exec_requests r  
         CROSS APPLY sys.dm_exec_sql_text(r.sql_handle) t  
         LEFT JOIN sys.dm_exec_requests r2 ON r.blocking_session_id = r2.session_id  
         OUTER APPLY sys.dm_exec_sql_text(r2.sql_handle) t2  
WHERE  
    r.blocking_session_id IS NOT NULL  
  AND r.wait_type LIKE 'LCK%';
  
  **2 можно убить зависшие сессии командой** 
  KILL <id сессии>;
  
  **3 бывает так что сессия которая держит блокировку закрыта но ее транзакция открыта чтобы найти такие транзакции нужен этот запрос** 
SELECT  
    s.session_id,  
    s.login_name,  
    s.host_name,  
    s.program_name,  
    s.last_request_start_time,  
    s.last_request_end_time,  
    t.transaction_id,  
    t.transaction_begin_time,  
    t.transaction_type,  
    t.transaction_state,  
    CASE t.transaction_state  
        WHEN 2 THEN 'Active'  
        WHEN 3 THEN 'Ended'  
        WHEN 4 THEN 'Commit initiated'  
        WHEN 7 THEN 'Rolling back'  
        END AS transaction_state_desc  
FROM sys.dm_tran_session_transactions st  
         INNER JOIN sys.dm_tran_active_transactions t ON st.transaction_id = t.transaction_id  
         INNER JOIN sys.dm_exec_sessions s ON st.session_id = s.session_id  
WHERE s.is_user_process = 1  
ORDER BY t.transaction_begin_time;

**4 допустим нашли транзакцию, чтобы посмотреть на нее запрос (меняем id сессии)**

SELECT 
    transaction_id,
    name,
    transaction_begin_time,
    transaction_type,
    transaction_state,
    transaction_status,
    transaction_status2
FROM sys.dm_tran_active_transactions
WHERE transaction_id IN (
    SELECT transaction_id 
    FROM sys.dm_tran_session_transactions 
    WHERE session_id = 149
);
**или наоборот найти сессии по транзакции** 
###
SELECT 
    s.session_id,
    s.login_name,
    s.host_name, 
    s.program_name,
    s.status,
    s.last_request_start_time,
    s.last_request_end_time
FROM sys.dm_tran_session_transactions st
INNER JOIN sys.dm_exec_sessions s ON st.session_id = s.session_id
WHERE st.transaction_id = 502186074;



