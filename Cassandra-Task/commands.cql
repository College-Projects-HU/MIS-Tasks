-- ============================================================================
-- Part 2: Shell (CQL - Cassandra Query Language) Tasks
-- Note: You run these commands inside the Cassandra Shell (cqlsh).
-- ============================================================================
USE store;

-- ----------------------------------------------------------------------------
-- Requirement 1: Select specific rows in a descending order based on partition key
-- ----------------------------------------------------------------------------
-- Explanation: In Cassandra, data is partitioned by the "partition key" ('model'). 
-- Within each partition, data is sorted by the "clustering key" ('id'). 
-- To order results, you MUST filter by a specific partition key first.
SELECT * FROM laptop 
WHERE model = 'Pro' 
ORDER BY id DESC;

-- ----------------------------------------------------------------------------
-- Requirement 2: Create a materialized view to select rows using any attribute 
--                not a part of the primary key.
-- ----------------------------------------------------------------------------
-- Explanation: By default, Cassandra only lets you query (WHERE clause) using primary keys.
-- To query by an ordinary column like 'name', we use a Materialized View. 
-- It creates a continuously updating hidden table that uses 'name' as its primary key.
CREATE MATERIALIZED VIEW IF NOT EXISTS laptop_by_name AS
    SELECT model, id, name, price, stock
    FROM laptop
    -- All components of the view's primary key must be checked for IS NOT NULL
    WHERE name IS NOT NULL 
      AND model IS NOT NULL 
      AND id IS NOT NULL
    PRIMARY KEY (name, model, id);

-- Example test of the view (this allows querying by 'name' which was impossible before)
SELECT * FROM laptop_by_name WHERE name = 'Dell XPS 13';
