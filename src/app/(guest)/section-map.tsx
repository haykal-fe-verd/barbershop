"use client";

import React from "react";

function SectionMap() {
    return (
        <section id="section-map">
            <div>
                <iframe
                    title="Map of Aceh Polytechnic"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2896.4718251982995!2d95.34425339057866!3d5.535384644451843!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3040377e768f191d%3A0x68c7d46f7bafc512!2sAceh%20Polytechnic!5e0!3m2!1sen!2sid!4v1723374158928!5m2!1sen!2sid"
                    width="100%"
                    height="450"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                />
            </div>
        </section>
    );
}

export default SectionMap;
