import { NextApiResponse, NextApiRequest } from 'next';

import { parse } from '../../utils/apiResolvers';
import { MediaType, Media } from '../../types';
import getInstance from '../../utils/axios';

interface Response {
  type: 'Success' | 'Error';
  data: Media[] | Error;
}

export default async function handler(request: NextApiRequest, response: NextApiResponse<Response>) {
  const axios = getInstance();
  const { type, genre } = request.query;

  try {
    const result = await axios.get(`/discover`, {
      params: {
        type: type,
        genre: genre,
      }
    });
    const data = parse(result.data, type as MediaType);

    response.status(200).json({ type: 'Success', data });
  } catch (error) {
    console.log(error.data);
    response.status(500).json({ type: 'Error', data: error.data });
  }
}
