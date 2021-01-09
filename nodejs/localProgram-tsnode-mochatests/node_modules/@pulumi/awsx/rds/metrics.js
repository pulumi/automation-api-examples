"use strict";
// Copyright 2016-2018, Pulumi Corporation.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
Object.defineProperty(exports, "__esModule", { value: true });
const cloudwatch = require("../cloudwatch");
var metrics;
(function (metrics) {
    /**
     * Creates an AWS/RDS metric with the requested [metricName]. See
     * https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/MonitoringOverview.html#monitoring-cloudwatch
     * for list of all metric-names.
     *
     * Note, individual metrics can easily be obtained without supplying the name using the other
     * [metricXXX] functions.
     *
     * You can monitor DB instances using Amazon CloudWatch, which collects and processes raw data from
     * Amazon RDS into readable, near real-time metrics. These statistics are recorded for a period of
     * two weeks, so that you can access historical information and gain a better perspective on how
     * your web application or service is performing. By default, Amazon RDS metric data is
     * automatically sent to CloudWatch in 1-minute periods.
     *
     * Amazon RDS metrics data can be filtered by using any of the following dimensions:
     *
     * 1. "DBInstanceIdentifier": This dimension filters the data you request for a specific database
     *    instance.
     * 2. "DBClusterIdentifier": This dimension filters the data you request for a specific Amazon
     *    Aurora DB cluster.
     * 3. "DBClusterIdentifier, Role": This dimension filters the data you request for a specific Aurora
     *    DB cluster, aggregating the metric by instance role (WRITER/READER). For example, you can
     *    aggregate metrics for all READER instances that belong to a cluster.
     * 4. "DatabaseClass": This dimension filters the data you request for all instances in a database
     *    class. For example, you can aggregate metrics for all instances that belong to the database
     *    class db.m1.small
     * 5. "EngineName": This dimension filters the data you request for the identified engine name only.
     *    For example, you can aggregate metrics for all instances that have the engine name mysql.
     * 6. "SourceRegion": This dimension filters the data you request for the specified region only. For
     *    example, you can aggregate metrics for all instances in the region us-east-1.
     */
    function metric(metricName, change = {}) {
        const dimensions = {};
        if (change.cluster !== undefined) {
            dimensions.DBClusterIdentifier = change.cluster.id;
        }
        if (change.instance !== undefined) {
            dimensions.DBInstanceIdentifier = change.instance.id;
        }
        if (change.role !== undefined) {
            dimensions.Role = change.role;
        }
        if (change.databaseClass !== undefined) {
            dimensions.DatabaseClass = change.databaseClass;
        }
        if (change.engineName !== undefined) {
            dimensions.EngineName = change.engineName;
        }
        if (change.sourceRegion !== undefined) {
            dimensions.SourceRegion = change.sourceRegion;
        }
        return new cloudwatch.Metric(Object.assign({ namespace: "AWS/RDS", name: metricName }, change)).withDimensions(dimensions);
    }
    /**
     * The amount of disk space occupied by binary logs on the master. Applies to MySQL read
     * replicas.
     *
     * Units: Bytes
     */
    function binLogDiskUsage(change) {
        return metric("BinLogDiskUsage", Object.assign({ unit: "Bytes" }, change));
    }
    metrics.binLogDiskUsage = binLogDiskUsage;
    /**
     * The percent of General Purpose SSD (gp2) burst-bucket I/O credits available.
     *
     * Units: Percent
     */
    function burstBalance(change) {
        return metric("BurstBalance", Object.assign({ unit: "Percent" }, change));
    }
    metrics.burstBalance = burstBalance;
    /**
     * The percentage of CPU utilization.
     *
     * Units: Percent
     */
    function cpuUtilization(change) {
        return metric("CPUUtilization", Object.assign({ unit: "Percent" }, change));
    }
    metrics.cpuUtilization = cpuUtilization;
    /**
     * [T2 instances] The number of CPU credits spent by the instance for CPU utilization. One CPU
     * credit equals one vCPU running at 100% utilization for one minute or an equivalent
     * combination of vCPUs, utilization, and time (for example, one vCPU running at 50% utilization
     * for two minutes or two vCPUs running at 25% utilization for two minutes).
     *
     * CPU credit metrics are available at a five-minute frequency only. If you specify a period
     * greater than five minutes, use the Sum statistic instead of the Average statistic.
     */
    function cpuCreditUsage(change) {
        return metric("CPUCreditUsage", change);
    }
    metrics.cpuCreditUsage = cpuCreditUsage;
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
    function cpuCreditBalance(change) {
        return metric("CPUCreditBalance", change);
    }
    metrics.cpuCreditBalance = cpuCreditBalance;
    /**
     * The number of database connections in use.
     *
     * Units: Count
     */
    function databaseConnections(change) {
        return metric("DatabaseConnections", Object.assign({ unit: "Count" }, change));
    }
    metrics.databaseConnections = databaseConnections;
    /**
     * The number of outstanding IOs (read/write requests) waiting to access the disk.
     *
     * Units: Count
     */
    function diskQueueDepth(change) {
        return metric("DiskQueueDepth", Object.assign({ unit: "Count" }, change));
    }
    metrics.diskQueueDepth = diskQueueDepth;
    /**
     * The number of failed SQL Server Agent jobs during the last minute.
     *
     * Unit: Count/Minute
     */
    function failedSQLServerAgentJobsCount(change) {
        return metric("FailedSQLServerAgentJobsCount", Object.assign({ period: 60, unit: "Count" }, change));
    }
    metrics.failedSQLServerAgentJobsCount = failedSQLServerAgentJobsCount;
    /**
     * The amount of available random access memory.
     *
     * Units: Bytes
     */
    function freeableMemory(change) {
        return metric("FreeableMemory", Object.assign({ unit: "Bytes" }, change));
    }
    metrics.freeableMemory = freeableMemory;
    /**
     * The amount of available storage space.
     *
     * Units: Bytes
     */
    function freeStorageSpace(change) {
        return metric("FreeStorageSpace", Object.assign({ unit: "Bytes" }, change));
    }
    metrics.freeStorageSpace = freeStorageSpace;
    /**
     * The maximum transaction ID that has been used. Applies to PostgreSQL.
     *
     * Units: Count
     */
    function maximumUsedTransactionIDs(change) {
        return metric("MaximumUsedTransactionIDs", Object.assign({ unit: "Count" }, change));
    }
    metrics.maximumUsedTransactionIDs = maximumUsedTransactionIDs;
    /**
     * The incoming (Receive) network traffic on the DB instance, including both customer database
     * traffic and Amazon RDS traffic used for monitoring and replication.
     *
     * Units: Bytes/Second
     */
    function networkReceiveThroughput(change) {
        return metric("NetworkReceiveThroughput", Object.assign({ unit: "Bytes/Second" }, change));
    }
    metrics.networkReceiveThroughput = networkReceiveThroughput;
    /**
     * The outgoing (Transmit) network traffic on the DB instance, including both customer database
     * traffic and Amazon RDS traffic used for monitoring and replication.
     *
     * Units: Bytes/Second
     */
    function networkTransmitThroughput(change) {
        return metric("NetworkTransmitThroughput", Object.assign({ unit: "Bytes/Second" }, change));
    }
    metrics.networkTransmitThroughput = networkTransmitThroughput;
    /**
     * The lagging size of the replica lagging the most in terms of WAL data received. Applies to
     * PostgreSQL.
     *
     * Units: Megabytes
     */
    function oldestReplicationSlotLag(change) {
        return metric("OldestReplicationSlotLag", Object.assign({ unit: "Megabytes" }, change));
    }
    metrics.oldestReplicationSlotLag = oldestReplicationSlotLag;
    /**
     * The average number of disk read I/O operations per second.
     *
     * Units: Count/Second
     */
    function readIOPS(change) {
        return metric("ReadIOPS", Object.assign({ unit: "Count/Second" }, change));
    }
    metrics.readIOPS = readIOPS;
    /**
     * The average amount of time taken per disk I/O operation.
     *
     * Units: Seconds
     */
    function readLatency(change) {
        return metric("ReadLatency", Object.assign({ unit: "Seconds" }, change));
    }
    metrics.readLatency = readLatency;
    /**
     * The average number of bytes read from disk per second.
     *
     * Units: Bytes/Second
     */
    function readThroughput(change) {
        return metric("ReadThroughput", Object.assign({ unit: "Bytes/Second" }, change));
    }
    metrics.readThroughput = readThroughput;
    /**
     * The amount of time a Read Replica DB instance lags behind the source DB instance. Applies to
     * MySQL, MariaDB, and PostgreSQL Read Replicas.
     *
     * Units: Seconds
     */
    function replicaLag(change) {
        return metric("ReplicaLag", Object.assign({ unit: "Seconds" }, change));
    }
    metrics.replicaLag = replicaLag;
    /**
     * The disk space used by replication slot files. Applies to PostgreSQL.
     *
     * Units: Megabytes
     */
    function replicationSlotDiskUsage(change) {
        return metric("ReplicationSlotDiskUsage", Object.assign({ unit: "Megabytes" }, change));
    }
    metrics.replicationSlotDiskUsage = replicationSlotDiskUsage;
    /**
     * The amount of swap space used on the DB instance. This metric is not available for SQL
     * Server.
     *
     * Units: Bytes
     */
    function swapUsage(change) {
        return metric("SwapUsage", Object.assign({ unit: "Bytes" }, change));
    }
    metrics.swapUsage = swapUsage;
    /**
     * The disk space used by transaction logs. Applies to PostgreSQL.
     *
     * Units: Megabytes
     */
    function transactionLogsDiskUsage(change) {
        return metric("TransactionLogsDiskUsage", Object.assign({ unit: "Megabytes" }, change));
    }
    metrics.transactionLogsDiskUsage = transactionLogsDiskUsage;
    /**
     * The size of transaction logs generated per second. Applies to PostgreSQL.
     *
     * Units: Megabytes/Second
     */
    function transactionLogsGeneration(change) {
        return metric("TransactionLogsGeneration", Object.assign({ unit: "Megabytes/Second" }, change));
    }
    metrics.transactionLogsGeneration = transactionLogsGeneration;
    /**
     * The average number of disk write I/O operations per second.
     *
     * Units: Count/Second
     */
    function writeIOPS(change) {
        return metric("WriteIOPS", Object.assign({ unit: "Count/Second" }, change));
    }
    metrics.writeIOPS = writeIOPS;
    /**
     * The average amount of time taken per disk I/O operation.
     *
     * Units: Seconds
     */
    function writeLatency(change) {
        return metric("WriteLatency", Object.assign({ unit: "Seconds" }, change));
    }
    metrics.writeLatency = writeLatency;
    /**
     * The average number of bytes written to disk per second.
     *
     * Units: Bytes/Second
     */
    function writeThroughput(change) {
        return metric("WriteThroughput", Object.assign({ unit: "Bytes/Second" }, change));
    }
    metrics.writeThroughput = writeThroughput;
    // aurora functions
    /**
     * The average number of current transactions executing on an Aurora database instance per
     * second. By default, Aurora doesn't enable this metric. To begin measuring this value, set
     * innodb_monitor_enable='all' in the DB parameter group for a specific DB instance.
     *
     * Applies to: Aurora MySQL
     */
    function activeTransactions(change) {
        return metric("ActiveTransactions", Object.assign({}, change));
    }
    metrics.activeTransactions = activeTransactions;
    /**
     * The amount of time a replica DB cluster running on Aurora with MySQL compatibility lags
     * behind the source DB cluster. This metric reports the value of the Seconds_Behind_Master
     * field of the MySQL SHOW SLAVE STATUS command. This metric is useful for monitoring replica
     * lag between Aurora DB clusters that are replicating across different AWS Regions. For more
     * information, see Aurora MySQL Replication.
     *
     * Applies to: Aurora MySQL
     */
    function auroraBinlogReplicaLag(change) {
        return metric("AuroraBinlogReplicaLag", Object.assign({}, change));
    }
    metrics.auroraBinlogReplicaLag = auroraBinlogReplicaLag;
    /**
     * Units: Bytes
     *
     * Applies to: Aurora MySQL
     */
    function auroraGlobalDBReplicatedWriteIO(change) {
        return metric("AuroraGlobalDBReplicatedWriteIO", Object.assign({ unit: "Bytes" }, change));
    }
    metrics.auroraGlobalDBReplicatedWriteIO = auroraGlobalDBReplicatedWriteIO;
    /**
     * Units: Bytes
     *
     * Applies to: Aurora MySQL
     */
    function auroraGlobalDBDataTransferBytes(change) {
        return metric("AuroraGlobalDBDataTransferBytes", Object.assign({ unit: "Bytes" }, change));
    }
    metrics.auroraGlobalDBDataTransferBytes = auroraGlobalDBDataTransferBytes;
    /**
     * Units: Milliseconds
     *
     * Applies to: Aurora MySQL
     */
    function auroraGlobalDBReplicationLag(change) {
        return metric("AuroraGlobalDBReplicationLag", Object.assign({ unit: "Milliseconds" }, change));
    }
    metrics.auroraGlobalDBReplicationLag = auroraGlobalDBReplicationLag;
    /**
     * For an Aurora Replica, the amount of lag when replicating updates from the primary instance,
     * in milliseconds.
     *
     * Applies to: Aurora MySQL and Aurora PostgreSQL
     */
    function auroraReplicaLag(change) {
        return metric("AuroraReplicaLag", Object.assign({ unit: "Milliseconds" }, change));
    }
    metrics.auroraReplicaLag = auroraReplicaLag;
    /**
     * The maximum amount of lag between the primary instance and each Aurora DB instance in the DB
     * cluster, in milliseconds.
     *
     * Applies to: Aurora MySQL and Aurora PostgreSQL
     */
    function auroraReplicaLagMaximum(change) {
        return metric("AuroraReplicaLagMaximum", Object.assign({ unit: "Milliseconds" }, change));
    }
    metrics.auroraReplicaLagMaximum = auroraReplicaLagMaximum;
    /**
     * The minimum amount of lag between the primary instance and each Aurora DB instance in the DB
     * cluster, in milliseconds.
     *
     * Applies to: Aurora MySQL and Aurora PostgreSQL
     */
    function auroraReplicaLagMinimum(change) {
        return metric("AuroraReplicaLagMinimum", Object.assign({ unit: "Milliseconds" }, change));
    }
    metrics.auroraReplicaLagMinimum = auroraReplicaLagMinimum;
    /**
     * The number of backtrack change records created over five minutes for your DB cluster.
     *
     * Applies to: Aurora MySQL
     */
    function backtrackChangeRecordsCreationRate(change) {
        return metric("BacktrackChangeRecordsCreationRate", Object.assign({}, change));
    }
    metrics.backtrackChangeRecordsCreationRate = backtrackChangeRecordsCreationRate;
    /**
     * The actual number of backtrack change records used by your DB cluster.
     *
     * Applies to: Aurora MySQL
     */
    function backtrackChangeRecordsStored(change) {
        return metric("BacktrackChangeRecordsStored", Object.assign({}, change));
    }
    metrics.backtrackChangeRecordsStored = backtrackChangeRecordsStored;
    /**
     * The difference between the target backtrack window and the actual backtrack window.
     *
     * Applies to: Aurora MySQL
     */
    function backtrackWindowActual(change) {
        return metric("BacktrackWindowActual", Object.assign({}, change));
    }
    metrics.backtrackWindowActual = backtrackWindowActual;
    /**
     * The number of times that the actual backtrack window is smaller than the target backtrack
     * window for a given period of time.
     *
     * Applies to: Aurora MySQL
     */
    function backtrackWindowAlert(change) {
        return metric("BacktrackWindowAlert", Object.assign({}, change));
    }
    metrics.backtrackWindowAlert = backtrackWindowAlert;
    /**
     * The total amount of backup storage in GiB used to support the point-in-time restore feature
     * within the Aurora DB cluster's backup retention window. Included in the total reported by the
     * TotalBackupStorageBilled metric. Computed separately for each Aurora cluster. For
     * instructions, see Understanding Aurora Backup Storage Usage. Units: Gibibytes (GiB)
     *
     * Applies to: Aurora MySQL and Aurora PostgreSQL
     */
    function backupRetentionPeriodStorageUsed(change) {
        return metric("BackupRetentionPeriodStorageUsed", Object.assign({ unit: "Gigabytes" }, change));
    }
    metrics.backupRetentionPeriodStorageUsed = backupRetentionPeriodStorageUsed;
    /**
     * The average number of transactions in the database that are blocked per second.
     *
     * Applies to: Aurora MySQL
     */
    function blockedTransactions(change) {
        return metric("BlockedTransactions", Object.assign({}, change));
    }
    metrics.blockedTransactions = blockedTransactions;
    /**
     * The percentage of requests that are served by the buffer cache.
     *
     * Applies to: Aurora MySQL and Aurora PostgreSQL
     */
    function bufferCacheHitRatio(change) {
        return metric("BufferCacheHitRatio", Object.assign({}, change));
    }
    metrics.bufferCacheHitRatio = bufferCacheHitRatio;
    /**
     * The amount of latency for commit operations, in milliseconds.
     *
     * Applies to: Aurora MySQL and Aurora PostgreSQL
     */
    function commitLatency(change) {
        return metric("CommitLatency", Object.assign({ unit: "Milliseconds" }, change));
    }
    metrics.commitLatency = commitLatency;
    /**
     * The average number of commit operations per second.
     *
     * Applies to: Aurora MySQL and Aurora PostgreSQL
     */
    function commitThroughput(change) {
        return metric("CommitThroughput", Object.assign({}, change));
    }
    metrics.commitThroughput = commitThroughput;
    /**
     * The amount of latency for data definition language (DDL) requests, in milliseconds—for
     * example, create, alter, and drop requests.
     *
     * Applies to: Aurora MySQL
     */
    function ddlLatency(change) {
        return metric("DDLLatency", Object.assign({}, change));
    }
    metrics.ddlLatency = ddlLatency;
    /**
     * The average number of DDL requests per second.
     *
     * Applies to: Aurora MySQL
     */
    function ddlThroughput(change) {
        return metric("DDLThroughput", Object.assign({}, change));
    }
    metrics.ddlThroughput = ddlThroughput;
    /**
     * The average number of deadlocks in the database per second.
     *
     * Applies to: Aurora MySQL and Aurora PostgreSQL
     */
    function deadlocks(change) {
        return metric("Deadlocks", Object.assign({}, change));
    }
    metrics.deadlocks = deadlocks;
    /**
     * The amount of latency for delete queries, in milliseconds.
     *
     * Applies to: Aurora MySQL
     */
    function deleteLatency(change) {
        return metric("DeleteLatency", Object.assign({ unit: "Milliseconds" }, change));
    }
    metrics.deleteLatency = deleteLatency;
    /**
     * The average number of delete queries per second.
     *
     * Applies to: Aurora MySQL
     */
    function deleteThroughput(change) {
        return metric("DeleteThroughput", Object.assign({}, change));
    }
    metrics.deleteThroughput = deleteThroughput;
    /**
     * The amount of latency for inserts, updates, and deletes, in milliseconds.
     *
     * Applies to: Aurora MySQL
     */
    function dmlLatency(change) {
        return metric("DMLLatency", Object.assign({ unit: "Milliseconds" }, change));
    }
    metrics.dmlLatency = dmlLatency;
    /**
     * The average number of inserts, updates, and deletes per second.
     *
     * Applies to: Aurora MySQL
     */
    function dmlThroughput(change) {
        return metric("DMLThroughput", Object.assign({}, change));
    }
    metrics.dmlThroughput = dmlThroughput;
    /**
     * The amount of time that the instance has been running, in seconds.
     *
     * Applies to: Aurora MySQL and Aurora PostgreSQL
     */
    function engineUptime(change) {
        return metric("EngineUptime", Object.assign({ unit: "Seconds" }, change));
    }
    metrics.engineUptime = engineUptime;
    /**
     * The amount of storage available for temporary tables and logs, in bytes. Unlike for other DB
     * engines, for Aurora DB instances this metric reports the amount of storage available to each
     * DB instance for temporary tables and logs. This value depends on the DB instance class (for
     * pricing information, see the Amazon RDS product page). You can increase the amount of free
     * storage space for an instance by choosing a larger DB instance class for your instance.
     *
     * Applies to: Aurora MySQL and Aurora PostgreSQL
     */
    function freeLocalStorage(change) {
        return metric("FreeLocalStorage", Object.assign({ unit: "Bytes" }, change));
    }
    metrics.freeLocalStorage = freeLocalStorage;
    /**
     * The amount of latency for insert queries, in milliseconds.
     *
     * Applies to: Aurora MySQL
     */
    function insertLatency(change) {
        return metric("InsertLatency", Object.assign({ unit: "Milliseconds" }, change));
    }
    metrics.insertLatency = insertLatency;
    /**
     * The average number of insert queries per second.
     *
     * Applies to: Aurora MySQL
     */
    function insertThroughput(change) {
        return metric("InsertThroughput", Object.assign({}, change));
    }
    metrics.insertThroughput = insertThroughput;
    /**
     * The average number of failed login attempts per second.
     *
     * Applies to: Aurora MySQL
     */
    function loginFailures(change) {
        return metric("LoginFailures", Object.assign({}, change));
    }
    metrics.loginFailures = loginFailures;
    /**
     * The amount of network throughput both received from and transmitted to clients by each
     * instance in the Aurora MySQL DB cluster, in bytes per second. This throughput doesn't include
     * network traffic between instances in the DB cluster and the cluster volume.
     *
     * Applies to: Aurora MySQL and Aurora PostgreSQL
     */
    function networkThroughput(change) {
        return metric("NetworkThroughput", Object.assign({ unit: "Bytes/Second" }, change));
    }
    metrics.networkThroughput = networkThroughput;
    /**
     * The average number of queries executed per second.
     *
     * Applies to: Aurora MySQL
     */
    function queries(change) {
        return metric("Queries", Object.assign({}, change));
    }
    metrics.queries = queries;
    /**
     * The amount of lag in seconds when replicating updates from the primary RDS PostgreSQL
     * instance to other nodes in the cluster.
     *
     * Applies to: Aurora PostgreSQL
     */
    function rdsToAuroraPostgreSQLReplicaLag(change) {
        return metric("RDSToAuroraPostgreSQLReplicaLag", Object.assign({}, change));
    }
    metrics.rdsToAuroraPostgreSQLReplicaLag = rdsToAuroraPostgreSQLReplicaLag;
    /**
     * The percentage of requests that are served by the Resultset cache.
     *
     * Applies to: Aurora MySQL
     */
    function resultSetCacheHitRatio(change) {
        return metric("ResultSetCacheHitRatio", Object.assign({}, change));
    }
    metrics.resultSetCacheHitRatio = resultSetCacheHitRatio;
    /**
     * The amount of latency for select queries, in milliseconds.
     *
     * Applies to: Aurora MySQL
     */
    function selectLatency(change) {
        return metric("SelectLatency", Object.assign({}, change));
    }
    metrics.selectLatency = selectLatency;
    /**
     * The average number of select queries per second.
     *
     * Applies to: Aurora MySQL
     */
    function selectThroughput(change) {
        return metric("SelectThroughput", Object.assign({}, change));
    }
    metrics.selectThroughput = selectThroughput;
    /**
     * The total amount of backup storage in GiB consumed by all Aurora snapshots for an Aurora DB
     * cluster outside its backup retention window. Included in the total reported by the
     * TotalBackupStorageBilled metric. Computed separately for each Aurora cluster. For
     * instructions, see Understanding Aurora Backup Storage Usage. Units: Gibibytes (GiB)
     *
     * Applies to: Aurora MySQL and Aurora PostgreSQL
     */
    function snapshotStorageUsed(change) {
        return metric("SnapshotStorageUsed", Object.assign({ unit: "Gigabytes" }, change));
    }
    metrics.snapshotStorageUsed = snapshotStorageUsed;
    /**
     * The total amount of backup storage in GiB for which you are billed for a given Aurora DB
     * cluster. Includes the backup storage measured by the BackupRetentionPeriodStorageUsed and
     * SnapshotStorageUsed metrics. Computed separately for each Aurora cluster. For instructions,
     * see Understanding Aurora Backup Storage Usage. Units: Gibibytes (GiB)
     *
     * Applies to: Aurora MySQL and Aurora PostgreSQL
     */
    function totalBackupStorageBilled(change) {
        return metric("TotalBackupStorageBilled", Object.assign({ unit: "Gigabytes" }, change));
    }
    metrics.totalBackupStorageBilled = totalBackupStorageBilled;
    /**
     * The amount of latency for update queries, in milliseconds.
     *
     * Applies to: Aurora MySQL
     */
    function updateLatency(change) {
        return metric("UpdateLatency", Object.assign({}, change));
    }
    metrics.updateLatency = updateLatency;
    /**
     * The average number of update queries per second.
     *
     * Applies to: Aurora MySQL
     */
    function updateThroughput(change) {
        return metric("UpdateThroughput", Object.assign({}, change));
    }
    metrics.updateThroughput = updateThroughput;
    /**
     * The amount of storage used by your Aurora DB instance, in bytes. This value affects the cost
     * of the Aurora DB cluster (for pricing information, see the Amazon RDS product page).
     *
     * Applies to: Aurora MySQL and Aurora PostgreSQL
     */
    function volumeBytesUsed(change) {
        return metric("VolumeBytesUsed", Object.assign({ unit: "Bytes" }, change));
    }
    metrics.volumeBytesUsed = volumeBytesUsed;
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
    function volumeReadIOPs(change) {
        return metric("VolumeReadIOPs", Object.assign({}, change));
    }
    metrics.volumeReadIOPs = volumeReadIOPs;
    /**
     * The number of write disk I/O operations to the cluster volume, reported at 5-minute
     * intervals. See the description of VolumeReadIOPS above for a detailed description of how
     * billed write operations are calculated.
     *
     * Applies to: Aurora MySQL and Aurora PostgreSQL
     */
    function volumeWriteIOPs(change) {
        return metric("VolumeWriteIOPs", Object.assign({}, change));
    }
    metrics.volumeWriteIOPs = volumeWriteIOPs;
})(metrics = exports.metrics || (exports.metrics = {}));
//# sourceMappingURL=metrics.js.map