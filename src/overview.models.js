/* 
! This folder would contain your schema files
! And the functions required for the schema would
! also lie over here.
*/

const db = require('./db.js');

const getProductInfo = async (id) => {
  const sql =
    `SELECT jsonb_pretty(jsonb_agg(js_object)) result
  from (
    SELECT 
      jsonb_build_object(
        'id', id,
        'name', name,
        'slogan', slogan,
        'description', description,
        'category', category,
        'default_price', default_price,
        'features', jsonb_agg(features)
        ) js_object
      FROM (
        SELECT
          t.*,
          jsonb_build_object(
            'feature', f.feature,
            'value', f.value
            ) features
          from products t
          join features f on f.productid = t.id
          ) f
        where id = ${id}
        group by id, name, slogan, description, category, default_price
        ) f;`
  let response = await db.query(sql);
  return response.rows;
}

const getProductStyles = async (id) => {
  const sql =
    `SELECT jsonb_agg(js_object) result 
	FROM (
			SELECT jsonb_build_object(
			'style_id', id,
			'name', name,
			'original_price',original_price,
			'sale_price', sale_price,
			'default?', default_style,
			'photos', jsonb_agg(DISTINCT photos),
			'skus', jsonb_agg(DISTINCT skus)
			) js_object
			FROM (
				SELECT 
					parent.*,
					jsonb_build_object(
						'thumbnail_url', p.thumbnail_url,
						'url', p.url
					) photos,
					jsonb_build_object(
						'id', s.id,
						'quantity', s.quantity,
						'size', s.size
					) skus
					FROM styles parent
					 join photos p on p.styleid = parent.id
					 join skus s on s.styleid = parent.id
				) f
					WHERE productid = ${id}
					GROUP BY id, productid, name, sale_price, original_price, default_style
		)f; `;
  let response = await db.query(sql);
  // console.log(response isinstanceof Promise);
  return response.rows;
}

const getRelatedProducts = async (id) => {
  const sql = `
  SELECT related_pid FROM related 
  WHERE cur_pid=${id};`;

  let response = await db.query(sql);
  return response.rows;
}

const getCart = async (token) => {
  const sql = `
  SELECT jsonb_agg(js_object) result
	FROM (
		SELECT 
			jsonb_build_object(
				'sku_id', product_id,
				'count', COUNT(user_session)
			) js_object
			FROM cart c
			WHERE user_session = ${token}
			GROUP BY user_session, product_id
		) f;`
  let response = await db.query(sql);
  return response.rows;
}


module.exports.queries = {
  getProductInfo,
  getProductStyles,
  getRelatedProducts,
  getCart,
}



