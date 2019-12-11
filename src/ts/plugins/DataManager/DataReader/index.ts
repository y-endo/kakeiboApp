import { GetDocumentsOption } from 'type/index';
import { database } from '@/ts/plugins/firebase/index.js';

class DataReader {
  public getDocument(id: string): Promise<firebase.firestore.DocumentData> {
    console.log('DataManager: DataReader.getDocument', id);
    return new Promise((resolve, reject) => {
      database
        .collection('data')
        .doc(id)
        .get()
        .then(document => {
          resolve(document.data());
        })
        .catch(error => {
          reject(error);
        });
    });
  }

  public getDocuments(option: GetDocumentsOption): Promise<firebase.firestore.DocumentData[]> {
    console.log('DataManager: DataReader.getDocuments', option);
    return new Promise(resolve => {
      const documents: firebase.firestore.DocumentData[] = [];
      const collection: firebase.firestore.CollectionReference = database.collection('data');
      let query: firebase.firestore.Query | null = null;

      if (option.where) {
        option.where.forEach(where => {
          query = collection.where(where.key, where.operator, where.value);
        });
      }
      if (option.orderBy) {
        option.orderBy.forEach(orderBy => {
          query = collection.orderBy(orderBy.key, orderBy.sort);
        });
      }

      const target = query === null ? collection : query;
      target.get().then(querySnapshot => {
        querySnapshot.forEach(document => {
          const data = document.data();
          data.id = document.id;
          documents.push(data);
        });

        console.log('読み込み数:', documents.length);

        resolve(documents);
      });
    });
  }

  public getHomeData(): Promise<firebase.firestore.DocumentData> {
    console.log('DataManager: DataReader.getHomeData');
    return new Promise(resolve => {
      const query = database.collection('home').doc('expenditure');

      query.get().then(document => {
        resolve(document.data());
      });
    });
  }
}

export default DataReader;
