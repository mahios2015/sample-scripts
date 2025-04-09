type TileQuery = {
  tile_query_id: number | null;
  query: string | null;
};

type Tile = {
  tile_id: number;
  tile_guid: string;
  tile_title: string;
  query: TileQuery | null;
  child_section: {
    section_title: string;
    tiles: Tile[]; // always empty based on your spec
  } | null;
};

type Section = {
  section_title: string;
  tiles: Tile[];
};

// Assume `rows` is the SQL result from the query above
function transformToNestedJSON(rows: any[]): Section[] {
  const sectionMap = new Map<string, Section>();

  for (const row of rows) {
    const sectionTitle = row.section_title;

    if (!sectionMap.has(sectionTitle)) {
      sectionMap.set(sectionTitle, {
        section_title: sectionTitle,
        tiles: []
      });
    }

    const section = sectionMap.get(sectionTitle)!;

    const tile: Tile = {
      tile_id: row.tile_id,
      tile_guid: row.tile_guid,
      tile_title: row.tile_title,
      query: row.tile_query_id ? {
        tile_query_id: row.tile_query_id,
        query: row.query
      } : null,
      child_section: row.child_section_title ? {
        section_title: row.child_section_title,
        tiles: [] // You can extend this if child tiles are needed later
      } : null
    };

    section.tiles.push(tile);
  }

  return Array.from(sectionMap.values());
}
