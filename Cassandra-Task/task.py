from cassandra.cluster import Cluster

# ==============================================================================
# Part 1: Python connection and Database Operations
# ==============================================================================

def main():
    # 1. Connect to the Cassandra Cluster
    # We are connecting to the local instance (localhost / 127.0.0.1) on port 9042
    print("Connecting to Cassandra on port 9042...")
    cluster = Cluster(['127.0.0.1'], port=9042)
    session = cluster.connect()

    # Create a Keyspace (similar to a 'Database' in SQL)
    # SimpleStrategy is used for a single local node. replication_factor=1 means 1 copy of data.
    session.execute("""
        CREATE KEYSPACE IF NOT EXISTS store 
        WITH replication = {'class': 'SimpleStrategy', 'replication_factor': '1'}
    """)
    
    # Switch to the 'store' keyspace
    session.set_keyspace('store')
    print("Connected to keyspace 'store'.")

    # -------------------------------------------------------------------------
    # Requirement: Create table with 3+ attributes + a composite primary key
    # -------------------------------------------------------------------------
    # A composite primary key means the key is made of more than one column.
    # Here, PRIMARY KEY (model, id) means:
    # - 'model' is the Partition Key (how data is distributed across servers)
    # - 'id' is the Clustering Key (how data is ordered within a partition)
    # The 3 other attributes are: name, price, stock
    print("Creating table 'laptop'...")
    session.execute("""
        CREATE TABLE IF NOT EXISTS laptop (
            model text,
            id int,
            name text,
            price double,
            stock int,
            PRIMARY KEY (model, id)
        )
    """)

    # Clear table if it already has data (for script re-runability)
    session.execute("TRUNCATE laptop")

    # -------------------------------------------------------------------------
    # Requirement: Add at least 5 rows
    # -------------------------------------------------------------------------
    print("Inserting 5 rows...")
    insert_query = "INSERT INTO laptop (model, id, name, price, stock) VALUES (%s, %s, %s, %s, %s)"
    
    # Executing the insert query 5 times with different data
    session.execute(insert_query, ('Pro', 101, 'MacBook Pro 14', 1999.99, 50))
    session.execute(insert_query, ('Pro', 102, 'MacBook Pro 16', 2499.99, 30))
    session.execute(insert_query, ('Air', 201, 'MacBook Air M2', 1199.99, 100))
    session.execute(insert_query, ('XPS', 301, 'Dell XPS 13', 1499.99, 45))
    session.execute(insert_query, ('ThinkPad', 401, 'Lenovo ThinkPad X1', 1399.99, 60))

    # -------------------------------------------------------------------------
    # Requirement: Update the value of any column
    # -------------------------------------------------------------------------
    # We must specify the full primary key (model and id) to update a row
    print("Updating the price for Pro laptop 101...")
    session.execute("""
        UPDATE laptop 
        SET price = 1899.99 
        WHERE model = 'Pro' AND id = 101
    """)

    # -------------------------------------------------------------------------
    # Requirement: Delete any row
    # -------------------------------------------------------------------------
    # Once again, the primary key must be provided to delete the row exactly
    print("Deleting Air laptop 201...")
    session.execute("""
        DELETE FROM laptop 
        WHERE model = 'Air' AND id = 201
    """)

    print("All Python operations completed successfully!")
    
    # Close the connection
    cluster.shutdown()

if __name__ == "__main__":
    main()
