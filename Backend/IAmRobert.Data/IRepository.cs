using System;
using System.Collections.Generic;
using System.Linq;

namespace IAmRobert.Data
{
    /// <summary>
    /// Interfaces for all data model repos
    /// </summary>
    /// <typeparam name="T"></typeparam>
    public interface IRepository<T> where T : class
    {
        /// <summary>
        /// Create the specified item.
        /// </summary>
        /// <returns>The create.</returns>
        /// <param name="item">Item.</param>
        T Create(T item);

        /// <summary>
        /// Deletes the specified item.
        /// </summary>
        /// <param name="item">The item.</param>
        void Delete(T item);

        /// <summary>
        /// Deletes the by range.
        /// </summary>
        /// <param name="items">Items.</param>
        void DeleteByRange(IList<T> items);

        /// <summary>
        /// Finds the specified function.
        /// </summary>
        /// <param name="func">The function.</param>
        /// <returns></returns>
        T Find(Func<T, bool> func = null);

        /// <summary>
        /// Finds the one.
        /// </summary>
        /// <param name="func">The function.</param>
        /// <returns></returns>
        T FindOne(Func<T, bool> func = null);

        /// <summary>
        /// Returns items for this instance.
        /// </summary>
        /// <returns></returns>
        IQueryable<T> Items();

        /// <summary>
        /// Update the specified item.
        /// </summary>
        /// <returns>The update.</returns>
        /// <param name="item">Item.</param>
        T Update(T item);

        /// <summary>
        /// Updates the range.
        /// </summary>
        /// <returns>The range.</returns>
        /// <param name="items">Items.</param>
        IList<T> UpdateRange(IList<T> items);
    }

    /// <summary>
    /// Handler for db actions
    /// </summary>
    /// <typeparam name="T"></typeparam>
    /// <seealso cref="IAmRobert.Data.IRepository{T}" />
    public class Repository<T> : IRepository<T> where T : class
    {
        private DataContext _context;
        private Microsoft.EntityFrameworkCore.DbSet<T> _set;

        /// <summary>
        /// Initializes a new instance of the <see cref="Repository{T}"/> class.
        /// </summary>
        /// <param name="context">The context.</param>
        public Repository(DataContext context)
        {
            _context = context;
            _set = _context.Set<T>();
        }

        /// <summary>
        /// Create the specified item.
        /// </summary>
        /// <param name="item">Item.</param>
        /// <returns>
        /// The create.
        /// </returns>
        public T Create(T item)
        {
            _set.Add(item);
            _context.SaveChanges();

            return item;
        }

        /// <summary>
        /// Deletes the specified item.
        /// </summary>
        /// <param name="item">The item.</param>
        public void Delete(T item)
        {
            _set.Remove(item);
            _context.SaveChanges();
        }

        /// <summary>
        /// Deletes the by range.
        /// </summary>
        /// <param name="items">Items.</param>
        public void DeleteByRange(IList<T> items)
        {
            _set.RemoveRange(items);
            _context.SaveChanges();
        }

        /// <summary>
        /// Finds the specified function.
        /// </summary>
        /// <param name="func">The function.</param>
        /// <returns></returns>
        public T Find(Func<T, bool> func = null)
        {
            return _set.FirstOrDefault(func);
        }

        /// <summary>
        /// Finds the one.
        /// </summary>
        /// <param name="func">The function.</param>
        /// <returns></returns>
        public T FindOne(Func<T, bool> func = null)
        {
            return _set.SingleOrDefault(func);
        }

        /// <summary>
        /// Returns items for this instance.
        /// </summary>
        /// <returns></returns>
        public IQueryable<T> Items()
        {
            return _set;
        }

        /// <summary>
        /// Update the specified item.
        /// </summary>
        /// <param name="item">Item.</param>
        /// <returns>
        /// The update.
        /// </returns>
        public T Update(T item)
        {
            _set.Update(item);
            _context.SaveChanges();

            return item;
        }

        /// <summary>
        /// Updates the range.
        /// </summary>
        /// <param name="items">Items.</param>
        /// <returns>
        /// The range.
        /// </returns>
        public IList<T> UpdateRange(IList<T> items)
        {
            _set.UpdateRange(items);
            _context.SaveChanges();

            return items;
        }
    }
}