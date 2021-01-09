import * as aws from "@pulumi/aws";
import * as cloudwatch from "../cloudwatch";
export declare namespace metrics {
    type RdsMetricName = "BinLogDiskUsage" | "BurstBalance" | "CPUUtilization" | "CPUCreditUsage" | "CPUCreditBalance" | "DatabaseConnections" | "DiskQueueDepth" | "FailedSQLServerAgentJobsCount" | "FreeableMemory" | "FreeStorageSpace" | "MaximumUsedTransactionIDs" | "NetworkReceiveThroughput" | "NetworkTransmitThroughput" | "OldestReplicationSlotLag" | "ReadIOPS" | "ReadLatency" | "ReadThroughput" | "ReplicaLag" | "ReplicationSlotDiskUsage" | "SwapUsage" | "TransactionLogsDiskUsage" | "TransactionLogsGeneration" | "WriteIOPS" | "WriteLatency" | "WriteThroughput" | "ActiveTransactions" | "AuroraBinlogReplicaLag" | "AuroraGlobalDBReplicatedWriteIO" | "AuroraGlobalDBDataTransferBytes" | "AuroraGlobalDBReplicationLag" | "AuroraReplicaLag" | "AuroraReplicaLagMaximum" | "AuroraReplicaLagMinimum" | "BacktrackChangeRecordsCreationRate" | "BacktrackChangeRecordsStored" | "BacktrackWindowActual" | "BacktrackWindowAlert" | "BackupRetentionPeriodStorageUsed" | "BinLogDiskUsage" | "BlockedTransactions" | "BufferCacheHitRatio" | "CommitLatency" | "CommitThroughput" | "CPUCreditBalance" | "CPUCreditUsage" | "CPUUtilization" | "DatabaseConnections" | "DDLLatency" | "DDLThroughput" | "Deadlocks" | "DeleteLatency" | "DeleteThroughput" | "DiskQueueDepth" | "DMLLatency" | "DMLThroughput" | "EngineUptime" | "FreeableMemory" | "FreeLocalStorage" | "InsertLatency" | "InsertThroughput" | "LoginFailures" | "MaximumUsedTransactionIDs" | "NetworkReceiveThroughput" | "NetworkThroughput" | "NetworkTransmitThroughput" | "Queries" | "RDSToAuroraPostgreSQLReplicaLag" | "ReadIOPS" | "ReadLatency" | "ReadThroughput" | "ResultSetCacheHitRatio" | "SelectLatency" | "SelectThroughput" | "SnapshotStorageUsed" | "SwapUsage" | "TotalBackupStorageBilled" | "TransactionLogsDiskUsage" | "UpdateLatency" | "UpdateThroughput" | "VolumeBytesUsed" | "VolumeReadIOPs" | "VolumeWriteIOPs" | "WriteIOPS" | "WriteLatency" | "WriteThroughput";
    interface RdsMetricChange extends cloudwatch.MetricChange {
        /**
         * Optional [Instance] to filter down events to.
         */
        instance?: aws.rds.Instance;
        /**
         * Optional [Cluster] to filter down events to.
         */
        cluster?: aws.rds.Cluster;
        /**
         * This dimension filters the data you request for a specific Aurora DB cluster, aggregating
         * the metric by instance role (WRITER/READER). For example, you can aggregate metrics for
         * all READER instances that belong to a cluster.
         *
         * If this is provided then [cluster] must be provided as well.
         */
        role?: "WRITER" | "READER";
        /**
         * This dimension filters the data you request for all instances in a database class. For
         * example, you can aggregate metrics for all instances that belong to the database class
         * [db.m1.small].
         */
        databaseClass?: string;
        /**
         * This dimension filters the data you request for the identified engine name only. For
         * example, you can aggregate metrics for all instances that have the engine name [mysql].
         */
        engineName?: string;
        /**
         * This dimension filters the data you request for the specified region only. For example,
         * you can aggregate metrics for all instances in the region [us-east-1].
         */
        sourceRegion?: aws.Region;
    }
    /**
     * The amount of disk space occupied by binary logs on the master. Applies to MySQL read
     * replicas.
     *
     * Units: Bytes
     */
    function binLogDiskUsage(change?: RdsMetricChange): cloudwatch.Metric;
    /**
     * The percent of General Purpose SSD (gp2) burst-bucket I/O credits available.
     *
     * Units: Percent
     */
    function burstBalance(change?: RdsMetricChange): cloudwatch.Metric;
    /**
     * The percentage of CPU utilization.
     *
     * Units: Percent
     */
    function cpuUtilization(change?: RdsMetricChange): cloudwatch.Metric;
    /**
     * [T2 instances] The number of CPU credits spent by the instance for CPU utilization. One CPU
     * credit equals one vCPU running at 100% utilization for one minute or an equivalent
     * combination of vCPUs, utilization, and time (for example, one vCPU running at 50% utilization
     * for two minutes or two vCPUs running at 25% utilization for two minutes).
     *
     * CPU credit metrics are available at a five-minute frequency only. If you specify a period
     * greater than five minutes, use the Sum statistic instead of the Average statistic.
     */
    function cpuCreditUsage(change?: RdsMetricChange): cloudwatch.Metric;
    /**
     * [T2 instances] The number of earned CPU credits that an instance has accrued since it was
     * launched or started. For T2 Standard, the CPUCreditBalance also includes the number of launch
     * credits that have been accrued.
     *
     * Credits are accrued in the credit balance after they are earned, and removed from the credit
     * balance when they are spent. The credit balance has a maximum limit, determined by the
     * instance size. Once the limit is reached, any new credits that are earned are discarded. For
     * T2 Standard, launch credits do not count towards the limit.
     *
     * The credits in the CPUCreditBalance are available for the instance to spend to burst beyond
     * its baseline CPU utilization.
     *
     * When an instance is running, credits in the CPUCreditBalance do not expire. When the instance
     * stops, the CPUCreditBalance does not persist, and all accrued credits are lost.
     *
     * CPU credit metrics are available at a five-minute frequency only.
     */
    function cpuCreditBalance(change?: RdsMetricChange): cloudwatch.Metric;
    /**
     * The number of database connections in use.
     *
     * Units: Count
     */
    function databaseConnections(change?: RdsMetricChange): cloudwatch.Metric;
    /**
     * The number of outstanding IOs (read/write requests) waiting to access the disk.
     *
     * Units: Count
     */
    function diskQueueDepth(change?: RdsMetricChange): cloudwatch.Metric;
    /**
     * The number of failed SQL Server Agent jobs during the last minute.
     *
     * Unit: Count/Minute
     */
    function failedSQLServerAgentJobsCount(change?: RdsMetricChange): cloudwatch.Metric;
    /**
     * The amount of available random access memory.
     *
     * Units: Bytes
     */
    function freeableMemory(change?: RdsMetricChange): cloudwatch.Metric;
    /**
     * The amount of available storage space.
     *
     * Units: Bytes
     */
    function freeStorageSpace(change?: RdsMetricChange): cloudwatch.Metric;
    /**
     * The maximum transaction ID that has been used. Applies to PostgreSQL.
     *
     * Units: Count
     */
    function maximumUsedTransactionIDs(change?: RdsMetricChange): cloudwatch.Metric;
    /**
     * The incoming (Receive) network traffic on the DB instance, including both customer database
     * traffic and Amazon RDS traffic used for monitoring and replication.
     *
     * Units: Bytes/Second
     */
    function networkReceiveThroughput(change?: RdsMetricChange): cloudwatch.Metric;
    /**
     * The outgoing (Transmit) network traffic on the DB instance, including both customer database
     * traffic and Amazon RDS traffic used for monitoring and replication.
     *
     * Units: Bytes/Second
     */
    function networkTransmitThroughput(change?: RdsMetricChange): cloudwatch.Metric;
    /**
     * The lagging size of the replica lagging the most in terms of WAL data received. Applies to
     * PostgreSQL.
     *
     * Units: Megabytes
     */
    function oldestReplicationSlotLag(change?: RdsMetricChange): cloudwatch.Metric;
    /**
     * The average number of disk read I/O operations per second.
     *
     * Units: Count/Second
     */
    function readIOPS(change?: RdsMetricChange): cloudwatch.Metric;
    /**
     * The average amount of time taken per disk I/O operation.
     *
     * Units: Seconds
     */
    function readLatency(change?: RdsMetricChange): cloudwatch.Metric;
    /**
     * The average number of bytes read from disk per second.
     *
     * Units: Bytes/Second
     */
    function readThroughput(change?: RdsMetricChange): cloudwatch.Metric;
    /**
     * The amount of time a Read Replica DB instance lags behind the source DB instance. Applies to
     * MySQL, MariaDB, and PostgreSQL Read Replicas.
     *
     * Units: Seconds
     */
    function replicaLag(change?: RdsMetricChange): cloudwatch.Metric;
    /**
     * The disk space used by replication slot files. Applies to PostgreSQL.
     *
     * Units: Megabytes
     */
    function replicationSlotDiskUsage(change?: RdsMetricChange): cloudwatch.Metric;
    /**
     * The amount of swap space used on the DB instance. This metric is not available for SQL
     * Server.
     *
     * Units: Bytes
     */
    function swapUsage(change?: RdsMetricChange): cloudwatch.Metric;
    /**
     * The disk space used by transaction logs. Applies to PostgreSQL.
     *
     * Units: Megabytes
     */
    function transactionLogsDiskUsage(change?: RdsMetricChange): cloudwatch.Metric;
    /**
     * The size of transaction logs generated per second. Applies to PostgreSQL.
     *
     * Units: Megabytes/Second
     */
    function transactionLogsGeneration(change?: RdsMetricChange): cloudwatch.Metric;
    /**
     * The average number of disk write I/O operations per second.
     *
     * Units: Count/Second
     */
    function writeIOPS(change?: RdsMetricChange): cloudwatch.Metric;
    /**
     * The average amount of time taken per disk I/O operation.
     *
     * Units: Seconds
     */
    function writeLatency(change?: RdsMetricChange): cloudwatch.Metric;
    /**
     * The average number of bytes written to disk per second.
     *
     * Units: Bytes/Second
     */
    function writeThroughput(change?: RdsMetricChange): cloudwatch.Metric;
    /**
     * The average number of current transactions executing on an Aurora database instance per
     * second. By default, Aurora doesn't enable this metric. To begin measuring this value, set
     * innodb_monitor_enable='all' in the DB parameter group for a specific DB instance.
     *
     * Applies to: Aurora MySQL
     */
    function activeTransactions(change?: RdsMetricChange): cloudwatch.Metric;
    /**
     * The amount of time a replica DB cluster running on Aurora with MySQL compatibility lags
     * behind the source DB cluster. This metric reports the value of the Seconds_Behind_Master
     * field of the MySQL SHOW SLAVE STATUS command. This metric is useful for monitoring replica
     * lag between Aurora DB clusters that are replicating across different AWS Regions. For more
     * information, see Aurora MySQL Replication.
     *
     * Applies to: Aurora MySQL
     */
    function auroraBinlogReplicaLag(change?: RdsMetricChange): cloudwatch.Metric;
    /**
     * Units: Bytes
     *
     * Applies to: Aurora MySQL
     */
    function auroraGlobalDBReplicatedWriteIO(change?: RdsMetricChange): cloudwatch.Metric;
    /**
     * Units: Bytes
     *
     * Applies to: Aurora MySQL
     */
    function auroraGlobalDBDataTransferBytes(change?: RdsMetricChange): cloudwatch.Metric;
    /**
     * Units: Milliseconds
     *
     * Applies to: Aurora MySQL
     */
    function auroraGlobalDBReplicationLag(change?: RdsMetricChange): cloudwatch.Metric;
    /**
     * For an Aurora Replica, the amount of lag when replicating updates from the primary instance,
     * in milliseconds.
     *
     * Applies to: Aurora MySQL and Aurora PostgreSQL
     */
    function auroraReplicaLag(change?: RdsMetricChange): cloudwatch.Metric;
    /**
     * The maximum amount of lag between the primary instance and each Aurora DB instance in the DB
     * cluster, in milliseconds.
     *
     * Applies to: Aurora MySQL and Aurora PostgreSQL
     */
    function auroraReplicaLagMaximum(change?: RdsMetricChange): cloudwatch.Metric;
    /**
     * The minimum amount of lag between the primary instance and each Aurora DB instance in the DB
     * cluster, in milliseconds.
     *
     * Applies to: Aurora MySQL and Aurora PostgreSQL
     */
    function auroraReplicaLagMinimum(change?: RdsMetricChange): cloudwatch.Metric;
    /**
     * The number of backtrack change records created over five minutes for your DB cluster.
     *
     * Applies to: Aurora MySQL
     */
    function backtrackChangeRecordsCreationRate(change?: RdsMetricChange): cloudwatch.Metric;
    /**
     * The actual number of backtrack change records used by your DB cluster.
     *
     * Applies to: Aurora MySQL
     */
    function backtrackChangeRecordsStored(change?: RdsMetricChange): cloudwatch.Metric;
    /**
     * The difference between the target backtrack window and the actual backtrack window.
     *
     * Applies to: Aurora MySQL
     */
    function backtrackWindowActual(change?: RdsMetricChange): cloudwatch.Metric;
    /**
     * The number of times that the actual backtrack window is smaller than the target backtrack
     * window for a given period of time.
     *
     * Applies to: Aurora MySQL
     */
    function backtrackWindowAlert(change?: RdsMetricChange): cloudwatch.Metric;
    /**
     * The total amount of backup storage in GiB used to support the point-in-time restore feature
     * within the Aurora DB cluster's backup retention window. Included in the total reported by the
     * TotalBackupStorageBilled metric. Computed separately for each Aurora cluster. For
     * instructions, see Understanding Aurora Backup Storage Usage. Units: Gibibytes (GiB)
     *
     * Applies to: Aurora MySQL and Aurora PostgreSQL
     */
    function backupRetentionPeriodStorageUsed(change?: RdsMetricChange): cloudwatch.Metric;
    /**
     * The average number of transactions in the database that are blocked per second.
     *
     * Applies to: Aurora MySQL
     */
    function blockedTransactions(change?: RdsMetricChange): cloudwatch.Metric;
    /**
     * The percentage of requests that are served by the buffer cache.
     *
     * Applies to: Aurora MySQL and Aurora PostgreSQL
     */
    function bufferCacheHitRatio(change?: RdsMetricChange): cloudwatch.Metric;
    /**
     * The amount of latency for commit operations, in milliseconds.
     *
     * Applies to: Aurora MySQL and Aurora PostgreSQL
     */
    function commitLatency(change?: RdsMetricChange): cloudwatch.Metric;
    /**
     * The average number of commit operations per second.
     *
     * Applies to: Aurora MySQL and Aurora PostgreSQL
     */
    function commitThroughput(change?: RdsMetricChange): cloudwatch.Metric;
    /**
     * The amount of latency for data definition language (DDL) requests, in milliseconds—for
     * example, create, alter, and drop requests.
     *
     * Applies to: Aurora MySQL
     */
    function ddlLatency(change?: RdsMetricChange): cloudwatch.Metric;
    /**
     * The average number of DDL requests per second.
     *
     * Applies to: Aurora MySQL
     */
    function ddlThroughput(change?: RdsMetricChange): cloudwatch.Metric;
    /**
     * The average number of deadlocks in the database per second.
     *
     * Applies to: Aurora MySQL and Aurora PostgreSQL
     */
    function deadlocks(change?: RdsMetricChange): cloudwatch.Metric;
    /**
     * The amount of latency for delete queries, in milliseconds.
     *
     * Applies to: Aurora MySQL
     */
    function deleteLatency(change?: RdsMetricChange): cloudwatch.Metric;
    /**
     * The average number of delete queries per second.
     *
     * Applies to: Aurora MySQL
     */
    function deleteThroughput(change?: RdsMetricChange): cloudwatch.Metric;
    /**
     * The amount of latency for inserts, updates, and deletes, in milliseconds.
     *
     * Applies to: Aurora MySQL
     */
    function dmlLatency(change?: RdsMetricChange): cloudwatch.Metric;
    /**
     * The average number of inserts, updates, and deletes per second.
     *
     * Applies to: Aurora MySQL
     */
    function dmlThroughput(change?: RdsMetricChange): cloudwatch.Metric;
    /**
     * The amount of time that the instance has been running, in seconds.
     *
     * Applies to: Aurora MySQL and Aurora PostgreSQL
     */
    function engineUptime(change?: RdsMetricChange): cloudwatch.Metric;
    /**
     * The amount of storage available for temporary tables and logs, in bytes. Unlike for other DB
     * engines, for Aurora DB instances this metric reports the amount of storage available to each
     * DB instance for temporary tables and logs. This value depends on the DB instance class (for
     * pricing information, see the Amazon RDS product page). You can increase the amount of free
     * storage space for an instance by choosing a larger DB instance class for your instance.
     *
     * Applies to: Aurora MySQL and Aurora PostgreSQL
     */
    function freeLocalStorage(change?: RdsMetricChange): cloudwatch.Metric;
    /**
     * The amount of latency for insert queries, in milliseconds.
     *
     * Applies to: Aurora MySQL
     */
    function insertLatency(change?: RdsMetricChange): cloudwatch.Metric;
    /**
     * The average number of insert queries per second.
     *
     * Applies to: Aurora MySQL
     */
    function insertThroughput(change?: RdsMetricChange): cloudwatch.Metric;
    /**
     * The average number of failed login attempts per second.
     *
     * Applies to: Aurora MySQL
     */
    function loginFailures(change?: RdsMetricChange): cloudwatch.Metric;
    /**
     * The amount of network throughput both received from and transmitted to clients by each
     * instance in the Aurora MySQL DB cluster, in bytes per second. This throughput doesn't include
     * network traffic between instances in the DB cluster and the cluster volume.
     *
     * Applies to: Aurora MySQL and Aurora PostgreSQL
     */
    function networkThroughput(change?: RdsMetricChange): cloudwatch.Metric;
    /**
     * The average number of queries executed per second.
     *
     * Applies to: Aurora MySQL
     */
    function queries(change?: RdsMetricChange): cloudwatch.Metric;
    /**
     * The amount of lag in seconds when replicating updates from the primary RDS PostgreSQL
     * instance to other nodes in the cluster.
     *
     * Applies to: Aurora PostgreSQL
     */
    function rdsToAuroraPostgreSQLReplicaLag(change?: RdsMetricChange): cloudwatch.Metric;
    /**
     * The percentage of requests that are served by the Resultset cache.
     *
     * Applies to: Aurora MySQL
     */
    function resultSetCacheHitRatio(change?: RdsMetricChange): cloudwatch.Metric;
    /**
     * The amount of latency for select queries, in milliseconds.
     *
     * Applies to: Aurora MySQL
     */
    function selectLatency(change?: RdsMetricChange): cloudwatch.Metric;
    /**
     * The average number of select queries per second.
     *
     * Applies to: Aurora MySQL
     */
    function selectThroughput(change?: RdsMetricChange): cloudwatch.Metric;
    /**
     * The total amount of backup storage in GiB consumed by all Aurora snapshots for an Aurora DB
     * cluster outside its backup retention window. Included in the total reported by the
     * TotalBackupStorageBilled metric. Computed separately for each Aurora cluster. For
     * instructions, see Understanding Aurora Backup Storage Usage. Units: Gibibytes (GiB)
     *
     * Applies to: Aurora MySQL and Aurora PostgreSQL
     */
    function snapshotStorageUsed(change?: RdsMetricChange): cloudwatch.Metric;
    /**
     * The total amount of backup storage in GiB for which you are billed for a given Aurora DB
     * cluster. Includes the backup storage measured by the BackupRetentionPeriodStorageUsed and
     * SnapshotStorageUsed metrics. Computed separately for each Aurora cluster. For instructions,
     * see Understanding Aurora Backup Storage Usage. Units: Gibibytes (GiB)
     *
     * Applies to: Aurora MySQL and Aurora PostgreSQL
     */
    function totalBackupStorageBilled(change?: RdsMetricChange): cloudwatch.Metric;
    /**
     * The amount of latency for update queries, in milliseconds.
     *
     * Applies to: Aurora MySQL
     */
    function updateLatency(change?: RdsMetricChange): cloudwatch.Metric;
    /**
     * The average number of update queries per second.
     *
     * Applies to: Aurora MySQL
     */
    function updateThroughput(change?: RdsMetricChange): cloudwatch.Metric;
    /**
     * The amount of storage used by your Aurora DB instance, in bytes. This value affects the cost
     * of the Aurora DB cluster (for pricing information, see the Amazon RDS product page).
     *
     * Applies to: Aurora MySQL and Aurora PostgreSQL
     */
    function volumeBytesUsed(change?: RdsMetricChange): cloudwatch.Metric;
    /**
     * The number of billed read I/O operations from a cluster volume, reported at 5-minute
     * intervals. Billed read operations are calculated at the cluster volume level, aggregated from
     * all instances in the Aurora DB cluster, and then reported at 5-minute intervals. The value is
     * calculated by taking the value of the Read operations metric over a 5-minute period. You can
     * determine the amount of billed read operations per second by taking the value of the Billed
     * read operations metric and dividing by 300 seconds. For example, if the Billed read
     * operations returns 13,686, then the billed read operations per second is 45 (13,686 / 300 =
     * 45.62). You accrue billed read operations for queries that request database pages that aren't
     * in the buffer cache and therefore must be loaded from storage. You might see spikes in billed
     * read operations as query results are read from storage and then loaded into the buffer cache.
     *
     * Applies to: Aurora MySQL and Aurora PostgreSQL
     */
    function volumeReadIOPs(change?: RdsMetricChange): cloudwatch.Metric;
    /**
     * The number of write disk I/O operations to the cluster volume, reported at 5-minute
     * intervals. See the description of VolumeReadIOPS above for a detailed description of how
     * billed write operations are calculated.
     *
     * Applies to: Aurora MySQL and Aurora PostgreSQL
     */
    function volumeWriteIOPs(change?: RdsMetricChange): cloudwatch.Metric;
}
