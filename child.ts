import sql from 'mssql';
import { transformToNestedJSON } from './transform';

async function fetchTiles() {
  const pool = await sql.connect({
    user: 'yourUser',
    password: 'yourPass',
    server: 'localhost',
    database: 'oms',
    options: {
      trustServerCertificate: true,
    }
  });

  const result = await pool.request().query(`
    SELECT 
      s.title AS section_title,
      t.tile_id,
      t.tile_guid,
      t.title AS tile_title,
      tq.tile_query_id,
      tq.query,
      cs.title AS child_section_title
    FROM dbo.tile t
    LEFT JOIN dbo.tile_section_tbl s ON t.tile_section_id = s.tile_section_id
    LEFT JOIN dbo.tile_query tq ON t.tile_id = tq.tile_id
    LEFT JOIN dbo.tile_section_tbl cs ON t.child_tile_section_id = cs.tile_section_id
    ORDER BY s.title, t.tile_id
  `);

  const jsonOutput = transformToNestedJSON(result.recordset);
  console.log(JSON.stringify(jsonOutput, null, 2));
}
